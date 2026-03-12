import asyncio
from datetime import datetime
from motor.motor_asyncio import AsyncIOMotorClient
from app.config import MONGODB_URL, MONGODB_DB_NAME


async def seed():
    client = AsyncIOMotorClient(MONGODB_URL)
    db = client[MONGODB_DB_NAME]

    # Clear existing data
    for col in ["regions", "monthly_updates", "pre_sales", "action_plans",
                "open_roles", "upcoming_releases", "new_hires", "bench_resources", "challenges"]:
        await db[col].drop()

    # Regions
    regions = [
        {"name": "India", "code": "IN", "is_active": True},
        {"name": "United States", "code": "US", "is_active": True},
        {"name": "United Kingdom", "code": "UK", "is_active": True},
        {"name": "Europe", "code": "EU", "is_active": True},
        {"name": "Asia Pacific", "code": "APAC", "is_active": True},
    ]
    result = await db.regions.insert_many([{**r, "created_at": datetime.utcnow(), "updated_at": datetime.utcnow()} for r in regions])
    region_ids = {r["code"]: str(rid) for r, rid in zip(regions, result.inserted_ids)}
    india_id = region_ids["IN"]
    us_id = region_ids["US"]
    uk_id = region_ids["UK"]

    # Monthly updates for India - last 6 months
    months_data = [
        {"month": "2025-10", "revenue": 4200000, "margin": 28.5, "total_headcount": 340, "billable_headcount": 290, "non_billable_headcount": 50, "male_count": 220, "female_count": 115, "other_gender_count": 5, "attrition_rate": 12.1, "upskill_count": 45},
        {"month": "2025-11", "revenue": 4350000, "margin": 29.2, "total_headcount": 348, "billable_headcount": 298, "non_billable_headcount": 50, "male_count": 225, "female_count": 118, "other_gender_count": 5, "attrition_rate": 11.8, "upskill_count": 52},
        {"month": "2025-12", "revenue": 4500000, "margin": 30.1, "total_headcount": 355, "billable_headcount": 302, "non_billable_headcount": 53, "male_count": 230, "female_count": 120, "other_gender_count": 5, "attrition_rate": 11.2, "upskill_count": 58},
        {"month": "2026-01", "revenue": 4650000, "margin": 30.8, "total_headcount": 362, "billable_headcount": 310, "non_billable_headcount": 52, "male_count": 234, "female_count": 123, "other_gender_count": 5, "attrition_rate": 10.5, "upskill_count": 63},
        {"month": "2026-02", "revenue": 4800000, "margin": 31.5, "total_headcount": 370, "billable_headcount": 318, "non_billable_headcount": 52, "male_count": 238, "female_count": 126, "other_gender_count": 6, "attrition_rate": 10.1, "upskill_count": 70},
        {"month": "2026-03", "revenue": 4950000, "margin": 32.0, "total_headcount": 378, "billable_headcount": 325, "non_billable_headcount": 53, "male_count": 242, "female_count": 130, "other_gender_count": 6, "attrition_rate": 9.8, "upskill_count": 75},
    ]
    for md in months_data:
        md["region_id"] = india_id
        md["created_at"] = datetime.utcnow()
        md["updated_at"] = datetime.utcnow()
    await db.monthly_updates.insert_many(months_data)

    # US monthly updates
    us_months = [
        {"month": "2026-01", "revenue": 8200000, "margin": 35.2, "total_headcount": 180, "billable_headcount": 162, "non_billable_headcount": 18, "male_count": 105, "female_count": 72, "other_gender_count": 3, "attrition_rate": 8.5, "upskill_count": 22},
        {"month": "2026-02", "revenue": 8500000, "margin": 36.0, "total_headcount": 185, "billable_headcount": 166, "non_billable_headcount": 19, "male_count": 108, "female_count": 74, "other_gender_count": 3, "attrition_rate": 8.2, "upskill_count": 25},
        {"month": "2026-03", "revenue": 8750000, "margin": 36.5, "total_headcount": 190, "billable_headcount": 172, "non_billable_headcount": 18, "male_count": 110, "female_count": 76, "other_gender_count": 4, "attrition_rate": 7.8, "upskill_count": 28},
    ]
    for md in us_months:
        md["region_id"] = us_id
        md["created_at"] = datetime.utcnow()
        md["updated_at"] = datetime.utcnow()
    await db.monthly_updates.insert_many(us_months)

    # Pre-Sales for India March 2026
    pre_sales = [
        {"region_id": india_id, "month": "2026-03", "type": "RFP", "title": "Cloud Migration - Banking Platform", "client": "HDFC Bank", "status": "In Progress", "value": 2500000, "display_order": 0},
        {"region_id": india_id, "month": "2026-03", "type": "Proposal", "title": "AI/ML Analytics Suite", "client": "Reliance Digital", "status": "Submitted", "value": 1800000, "display_order": 1},
        {"region_id": india_id, "month": "2026-03", "type": "RFP", "title": "DevOps Transformation", "client": "Infosys BPM", "status": "Won", "value": 3200000, "display_order": 2},
        {"region_id": india_id, "month": "2026-03", "type": "Proposal", "title": "Data Lake Implementation", "client": "Tata Communications", "status": "In Progress", "value": 1500000, "display_order": 3},
        {"region_id": india_id, "month": "2026-03", "type": "RFP", "title": "Microservices Architecture", "client": "Wipro Consumer", "status": "Submitted", "value": 2200000, "display_order": 4},
        {"region_id": india_id, "month": "2026-03", "type": "Proposal", "title": "Security Audit & Compliance", "client": "SBI Cards", "status": "Lost", "value": 800000, "display_order": 5},
    ]
    for ps in pre_sales:
        ps["created_at"] = datetime.utcnow()
        ps["updated_at"] = datetime.utcnow()
    await db.pre_sales.insert_many(pre_sales)

    # Action Plans
    action_plans = [
        {"region_id": india_id, "month": "2026-03", "action_item": "Complete AWS certification for 15 engineers", "assigned_to": "Priya Sharma", "due_date": "2026-03-31", "status": "In Progress", "priority": "High", "display_order": 0},
        {"region_id": india_id, "month": "2026-03", "action_item": "Onboard 8 new hires from campus recruitment", "assigned_to": "Rahul Gupta", "due_date": "2026-03-15", "status": "Completed", "priority": "High", "display_order": 1},
        {"region_id": india_id, "month": "2026-03", "action_item": "Reduce bench percentage to below 5%", "assigned_to": "Ankit Verma", "due_date": "2026-03-31", "status": "In Progress", "priority": "Critical", "display_order": 2},
        {"region_id": india_id, "month": "2026-03", "action_item": "Launch internal hackathon for innovation", "assigned_to": "Meera Patel", "due_date": "2026-03-20", "status": "Not Started", "priority": "Medium", "display_order": 3},
        {"region_id": india_id, "month": "2026-03", "action_item": "Finalize vendor contracts for Q2", "assigned_to": "Sanjay Kumar", "due_date": "2026-03-25", "status": "Delayed", "priority": "High", "display_order": 4},
    ]
    for ap in action_plans:
        ap["created_at"] = datetime.utcnow()
        ap["updated_at"] = datetime.utcnow()
    await db.action_plans.insert_many(action_plans)

    # Open Roles
    open_roles = [
        {"region_id": india_id, "month": "2026-03", "skill": "React/Node.js", "account": "HDFC Digital", "location": "Mumbai", "count": 3},
        {"region_id": india_id, "month": "2026-03", "skill": "React/Node.js", "account": "Flipkart", "location": "Bangalore", "count": 2},
        {"region_id": india_id, "month": "2026-03", "skill": "Python/ML", "account": "Reliance Jio", "location": "Hyderabad", "count": 4},
        {"region_id": india_id, "month": "2026-03", "skill": "Python/ML", "account": "Swiggy", "location": "Bangalore", "count": 2},
        {"region_id": india_id, "month": "2026-03", "skill": "Java/Spring Boot", "account": "ICICI Bank", "location": "Mumbai", "count": 3},
        {"region_id": india_id, "month": "2026-03", "skill": "DevOps/Cloud", "account": "Tech Mahindra", "location": "Pune", "count": 2},
        {"region_id": india_id, "month": "2026-03", "skill": "DevOps/Cloud", "account": "Infosys", "location": "Bangalore", "count": 1},
        {"region_id": india_id, "month": "2026-03", "skill": "QA Automation", "account": "Mindtree", "location": "Chennai", "count": 2},
    ]
    for r in open_roles:
        r["created_at"] = datetime.utcnow()
        r["updated_at"] = datetime.utcnow()
    await db.open_roles.insert_many(open_roles)

    # Upcoming Releases
    releases = [
        {"region_id": india_id, "month": "2026-03", "skill": "Java/Spring Boot", "account": "Wipro Consumer", "location": "Mumbai", "count": 2, "release_date": "2026-03-31"},
        {"region_id": india_id, "month": "2026-03", "skill": "React/Node.js", "account": "TCS", "location": "Chennai", "count": 1, "release_date": "2026-03-15"},
        {"region_id": india_id, "month": "2026-03", "skill": "Python/ML", "account": "Cognizant", "location": "Hyderabad", "count": 3, "release_date": "2026-03-28"},
        {"region_id": india_id, "month": "2026-03", "skill": "QA Automation", "account": "HCL Tech", "location": "Noida", "count": 2, "release_date": "2026-03-20"},
    ]
    for r in releases:
        r["created_at"] = datetime.utcnow()
        r["updated_at"] = datetime.utcnow()
    await db.upcoming_releases.insert_many(releases)

    # New Hires
    new_hires = [
        {"region_id": india_id, "month": "2026-03", "skill": "React/Node.js", "account": "HDFC Digital", "location": "Mumbai", "count": 2},
        {"region_id": india_id, "month": "2026-03", "skill": "Python/ML", "account": "Reliance Jio", "location": "Hyderabad", "count": 3},
        {"region_id": india_id, "month": "2026-03", "skill": "DevOps/Cloud", "account": "Bench", "location": "Bangalore", "count": 2},
        {"region_id": india_id, "month": "2026-03", "skill": "Java/Spring Boot", "account": "ICICI Bank", "location": "Mumbai", "count": 1},
    ]
    for r in new_hires:
        r["created_at"] = datetime.utcnow()
        r["updated_at"] = datetime.utcnow()
    await db.new_hires.insert_many(new_hires)

    # Bench Resources
    bench = [
        {"region_id": india_id, "month": "2026-03", "skill": "React/Node.js", "account": "Bench Pool", "location": "Mumbai", "count": 3},
        {"region_id": india_id, "month": "2026-03", "skill": "Java/Spring Boot", "account": "Bench Pool", "location": "Bangalore", "count": 2},
        {"region_id": india_id, "month": "2026-03", "skill": "Python/ML", "account": "Bench Pool", "location": "Hyderabad", "count": 4},
        {"region_id": india_id, "month": "2026-03", "skill": "QA Automation", "account": "Bench Pool", "location": "Chennai", "count": 2},
        {"region_id": india_id, "month": "2026-03", "skill": "DevOps/Cloud", "account": "Bench Pool", "location": "Pune", "count": 1},
    ]
    for r in bench:
        r["created_at"] = datetime.utcnow()
        r["updated_at"] = datetime.utcnow()
    await db.bench_resources.insert_many(bench)

    # Challenges
    challenges = [
        {"region_id": india_id, "month": "2026-03", "title": "High Attrition in Mid-Level Engineers", "description": "Attrition rate for 3-5 year experience band is at 15%", "severity": "High", "mitigation": "Retention bonus program and career path restructuring initiated"},
        {"region_id": india_id, "month": "2026-03", "title": "Skill Gap in AI/ML", "description": "Demand for AI/ML skills exceeding current capacity by 40%", "severity": "Critical", "mitigation": "Partnered with external training vendor, 20 engineers enrolled in 8-week program"},
        {"region_id": india_id, "month": "2026-03", "title": "Client Payment Delays", "description": "Two major clients have 60+ day outstanding invoices", "severity": "Medium", "mitigation": "Finance team escalation and weekly follow-ups scheduled"},
        {"region_id": india_id, "month": "2026-03", "title": "Infrastructure Cost Overrun", "description": "Cloud costs exceeded budget by 18% due to dev environment sprawl", "severity": "High", "mitigation": "Implementing automated resource cleanup and cost allocation tags"},
    ]
    for c in challenges:
        c["created_at"] = datetime.utcnow()
        c["updated_at"] = datetime.utcnow()
    await db.challenges.insert_many(challenges)

    # Create indexes
    await db.regions.create_index("code", unique=True)
    await db.monthly_updates.create_index([("region_id", 1), ("month", 1)], unique=True)

    print("✅ Seed data inserted successfully!")
    print(f"   Regions: {len(regions)}")
    print(f"   Monthly Updates: {len(months_data) + len(us_months)}")
    print(f"   Pre-Sales: {len(pre_sales)}")
    print(f"   Action Plans: {len(action_plans)}")
    print(f"   Open Roles: {len(open_roles)}")
    print(f"   Releases: {len(releases)}")
    print(f"   New Hires: {len(new_hires)}")
    print(f"   Bench: {len(bench)}")
    print(f"   Challenges: {len(challenges)}")

    client.close()


if __name__ == "__main__":
    asyncio.run(seed())
