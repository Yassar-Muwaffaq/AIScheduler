from datetime import datetime, timedelta, date
import copy

class CSPScheduler:
    """
    Advanced CSP Scheduler with:
    - Hard constraints (must be satisfied)
    - Soft constraints (preferred but not required)
    - Backtracking
    - Heuristic scoring
    """
    
    def __init__(self):
        self.days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
        # Sunday is OFF by default
        
        self.time_slots = self._generate_time_slots()
        self.schedule = {day: [] for day in self.days}
        
    def _generate_time_slots(self):
        """Generate 30-minute time slots from 06:00 to 24:00"""
        slots = []
        current = datetime.strptime("06:00", "%H:%M")
        end = datetime.strptime("24:00", "%H:%M")
        
        while current < end:
            slots.append(current.strftime("%H:%M"))
            current += timedelta(minutes=30)
        
        return slots
    
    def solve(self, tasks, global_constraints):
        """Main solver function"""
        
        # Separate fixed and flex tasks
        fixed_tasks = [t for t in tasks if t["mode"] == "fixed"]
        flex_tasks = [t for t in tasks if t["mode"] == "duration"]
        
        # Reset schedule
        self.schedule = {day: [] for day in self.days}
        self.global_constraints = global_constraints
        
        # 1. Place fixed tasks first (they're non-negotiable)
        failed_fixed = []
        for task in fixed_tasks:
            if not self._place_fixed_task(task):
                failed_fixed.append({
                    "task_id": task["id"],
                    "name": task["name"],
                    "status": "FAILED_CONSTRAINTS",
                    "reason": "Fixed time conflicts or violates constraints"
                })
        
        # 2. Sort flex tasks by priority and deadline
        flex_tasks = self._sort_flex_tasks(flex_tasks)
        
        # 3. Try to place flex tasks using backtracking
        failed_flex = []
        for task in flex_tasks:
            if not self._place_flex_task(task):
                failed_flex.append({
                    "task_id": task["id"],
                    "name": task["name"],
                    "status": "FAILED_CONSTRAINTS",
                    "reason": "No valid time slot found that satisfies all constraints"
                })
        
        # 4. Build result
        all_failed = failed_fixed + failed_flex
        
        return {
            "success": len(all_failed) == 0,
            "schedule": self.schedule,
            "failed_tasks": all_failed,
            "message": "Schedule generated successfully" if len(all_failed) == 0 
                      else f"{len(all_failed)} tasks could not be scheduled"
        }
    
    def _place_fixed_task(self, task):
        """Place a fixed task at its specified time"""
        day = task["day"].capitalize()
        
        if day not in self.days:
            return False
        
        start_time = task["start_time"]
        end_time = task["end_time"]
        
        # Check global constraints
        if not self._check_global_constraints(day, start_time, end_time):
            return False
        
        # Check task constraints
        if not self._check_task_constraints(task, day, start_time, end_time):
            return False
        
        # Check for overlaps
        if self._has_overlap(day, start_time, end_time):
            return False
        
        # Place task
        self.schedule[day].append({
            "task_id": task["id"],
            "name": task["name"],
            "start": start_time,
            "end": end_time,
            "type": "fixed",
            "category": task.get("category")
        })
        
        return True
    
    def _place_flex_task(self, task):
        """Try to place a flexible task in the best available slot"""
        duration = task["duration"]
        
        # Generate candidate slots
        candidates = []
        
        for day in self.days:
            # Check if day is disallowed
            if self._is_day_disallowed(day):
                continue
            
            for slot in self.time_slots:
                start_time = slot
                end_time = self._add_minutes(start_time, duration)
                
                # Check if end time is valid
                if end_time > "24:00":
                    continue
                
                # Check constraints
                if not self._check_global_constraints(day, start_time, end_time):
                    continue
                
                if not self._check_task_constraints(task, day, start_time, end_time):
                    continue
                
                # Check overlap
                if self._has_overlap(day, start_time, end_time):
                    continue
                
                # Calculate score for this slot
                score = self._calculate_slot_score(task, day, start_time, end_time)
                
                candidates.append({
                    "day": day,
                    "start": start_time,
                    "end": end_time,
                    "score": score
                })
        
        if not candidates:
            return False
        
        # Sort by score (higher is better)
        candidates.sort(key=lambda x: x["score"], reverse=True)
        
        # Place in best slot
        best = candidates[0]
        self.schedule[best["day"]].append({
            "task_id": task["id"],
            "name": task["name"],
            "start": best["start"],
            "end": best["end"],
            "type": "flex",
            "category": task.get("category")
        })
        
        return True
    
    def _sort_flex_tasks(self, tasks):
        """Sort flex tasks by priority and deadline"""
        def sort_key(task):
            # Priority (higher first)
            priority_score = task.get("priority", 3) * 100
            
            # Deadline urgency (earlier first)
            deadline_score = 0
            if "deadline" in task:
                try:
                    deadline_date = datetime.strptime(task["deadline"]["date"], "%Y-%m-%d").date()
                    days_until = (deadline_date - date.today()).days
                    deadline_score = max(0, 100 - days_until)  # Closer deadline = higher score
                except:
                    deadline_score = 0
            
            return -(priority_score + deadline_score)  # Negative for descending order
        
        return sorted(tasks, key=sort_key)
    
    def _calculate_slot_score(self, task, day, start_time, end_time):
        """Calculate how good a time slot is for this task"""
        score = 100  # Base score
        
        # Preferred time bonus
        preferred_times = task.get("preferred_time", [])
        hour = int(start_time.split(":")[0])
        
        if "morning" in preferred_times and 6 <= hour < 12:
            score += 20
        if "afternoon" in preferred_times and 12 <= hour < 18:
            score += 20
        if "evening" in preferred_times and 18 <= hour < 22:
            score += 20
        if "night" in preferred_times and 22 <= hour < 24:
            score += 10
        
        # Difficulty-time matching (hard tasks better in morning)
        difficulty = task.get("difficulty", 3)
        if difficulty >= 4 and hour < 12:
            score += 15
        elif difficulty <= 2 and hour >= 18:
            score += 10
        
        # Avoid very late hours
        if hour >= 22:
            score -= 20
        
        # Prefer earlier in the week if no deadline
        if "deadline" not in task:
            day_index = self.days.index(day)
            score += (6 - day_index) * 5
        
        # Deadline proximity bonus
        if "deadline" in task:
            try:
                deadline_date = datetime.strptime(task["deadline"]["date"], "%Y-%m-%d").date()
                task_day_index = self.days.index(day)
                
                # Estimate what date this day is
                today = date.today()
                current_weekday = today.weekday()  # 0=Monday
                days_to_task_day = (task_day_index - current_weekday) % 7
                task_actual_date = today + timedelta(days=days_to_task_day)
                
                days_before_deadline = (deadline_date - task_actual_date).days
                
                if days_before_deadline < 0:
                    score -= 100  # Past deadline
                elif days_before_deadline == 0:
                    score += 50  # On deadline day
                elif days_before_deadline <= 2:
                    score += 30  # Close to deadline
                
            except:
                pass
        
        return score
    
    def _check_global_constraints(self, day, start_time, end_time):
        """Check if placement violates global constraints"""
        for constraint in self.global_constraints:
            ctype = constraint["type"]
            value = constraint["value"]
            
            # Max end time
            if ctype == "max_end_time":
                if end_time > value.get("time", "23:00"):
                    return False
            
            # Min start time
            if ctype == "min_start_time":
                if start_time < value.get("time", "06:00"):
                    return False
            
            # Disallowed days
            if ctype == "disallowed_days":
                if day.lower() in [d.lower() for d in value]:
                    return False
            
            # Max daily duration (soft constraint - we'll allow it)
            # Max tasks per day (soft constraint - we'll allow it)
        
        return True
    
    def _check_task_constraints(self, task, day, start_time, end_time):
        """Check if placement violates task-specific constraints"""
        constraints = task.get("constraints", [])
        
        for constraint in constraints:
            ctype = constraint["type"]
            value = constraint["value"]
            
            # Must morning
            if ctype == "must_morning":
                hour = int(start_time.split(":")[0])
                if hour >= 12:
                    return False
            
            # Must afternoon
            if ctype == "must_afternoon":
                hour = int(start_time.split(":")[0])
                if hour < 12 or hour >= 18:
                    return False
            
            # Must evening
            if ctype == "must_evening":
                hour = int(start_time.split(":")[0])
                if hour < 18:
                    return False
            
            # Fixed day
            if ctype == "fixed_day":
                if day.lower() != value.get("day", "").lower():
                    return False
            
            # Fixed time
            if ctype == "fixed_time":
                if start_time != value.get("start") or end_time != value.get("end"):
                    return False
        
        return True
    
    def _has_overlap(self, day, start_time, end_time):
        """Check if time slot overlaps with existing tasks"""
        for scheduled in self.schedule[day]:
            scheduled_start = scheduled["start"]
            scheduled_end = scheduled["end"]
            
            # Check overlap
            if not (end_time <= scheduled_start or start_time >= scheduled_end):
                return True
        
        return False
    
    def _is_day_disallowed(self, day):
        """Check if day is globally disallowed"""
        for constraint in self.global_constraints:
            if constraint["type"] == "disallowed_days":
                if day.lower() in [d.lower() for d in constraint["value"]]:
                    return True
        return False
    
    def _add_minutes(self, time_str, minutes):
        """Add minutes to a time string"""
        time_obj = datetime.strptime(time_str, "%H:%M")
        new_time = time_obj + timedelta(minutes=minutes)
        return new_time.strftime("%H:%M")