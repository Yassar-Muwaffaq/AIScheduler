import datetime
from datetime import datetime as dt, timedelta

# Helper: parse time "HH:MM" → datetime.time
def parse_time(t):
    return dt.strptime(t, "%H:%M").time()

# Helper: add minutes to time
def add_minutes(time_obj, minutes):
    full = dt.combine(datetime.date.today(), time_obj) + timedelta(minutes=minutes)
    return full.time()


# ===============================
# CHECK GLOBAL CONSTRAINTS
# ===============================
def check_global_constraints(task_start, task_end, day, global_constraints):
    for cons in global_constraints:
        ctype = cons["type"]
        value = cons["value"]

        # 1. only allowed time range
        if ctype == "allowed_time_range":
            allowed_start = parse_time(value[0])
            allowed_end = parse_time(value[1])
            if task_start < allowed_start or task_end > allowed_end:
                return False

        # 2. disallowed days
        if ctype == "disallowed_days":
            if day in value:
                return False

        # 3. max daily duration — handled later

        # 4. max tasks per day — handled later

    return True


# ===============================
# CHECK TASK CONSTRAINTS
# ===============================
def check_task_constraints(task, day, start_time, end_time):
    for cons in task["constraints"]:
        ctype = cons["type"]
        value = cons["value"]

        # 5. fixed exact time
        if ctype == "fixed_time":
            fixed_start = parse_time(value["start"])
            fixed_end = parse_time(value["end"])
            if start_time != fixed_start or end_time != fixed_end:
                return False

        # 6. must morning
        if ctype == "must_morning":
            if start_time > parse_time("11:59"):
                return False

        # 7. must afternoon
        if ctype == "must_afternoon":
            if start_time < parse_time("12:00") or start_time > parse_time("18:00"):
                return False

        # 8. must evening
        if ctype == "must_evening":
            if start_time < parse_time("18:00"):
                return False

        # 9. must be in specific day
        if ctype == "day":
            if day != value:
                return False

    return True


# ===============================
# MAIN CSP SOLVER
# ===============================
def generate_schedule(tasks, global_constraints):

    # Sort task by priority (high → medium → low)
    priority_order = {"high": 1, "medium": 2, "low": 3}
    tasks = sorted(tasks, key=lambda t: priority_order.get(t.get("priority", "medium")))

    days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

    # Simpan hasil
    final_schedule = []

    # Tracking waktu per hari
    daily_slots = {day: [] for day in days}

    # ===============================
    # TRY PLACE EACH TASK
    # ===============================
    for task in tasks:

        duration = task["duration"]
        placed = False

        for day in days:

            # Skip disallowed days
            if any(c["type"] == "disallowed_days" and day in c["value"] for c in global_constraints):
                continue

            # Try every possible start time
            for hour in range(6, 23):  # 06:00 - 22:00
                for minute in [0, 30]:

                    start = dt.strptime(f"{hour:02d}:{minute:02d}", "%H:%M").time()
                    end = add_minutes(start, duration)

                    # Check overflow daily limit
                    if end < start:
                        continue

                    # Check global constraints
                    if not check_global_constraints(start, end, day, global_constraints):
                        continue

                    # Check task constraints
                    if not check_task_constraints(task, day, start, end):
                        continue

                    # Check overlap
                    overlap = False
                    for existing in daily_slots[day]:
                        if not (end <= existing["start"] or start >= existing["end"]):
                            overlap = True
                            break

                    if overlap:
                        continue

                    # Place task
                    scheduled = {
                        "task_id": task["id"],
                        "name": task["name"],
                        "day": day,
                        "start": start.strftime("%H:%M"),
                        "end": end.strftime("%H:%M")
                    }

                    final_schedule.append(scheduled)
                    daily_slots[day].append({"start": start, "end": end})
                    placed = True
                    break

                if placed:
                    break
            if placed:
                break

        if not placed:
            final_schedule.append({
                "task_id": task["id"],
                "name": task["name"],
                "status": "FAILED_CONSTRAINTS"
            })

    return final_schedule
