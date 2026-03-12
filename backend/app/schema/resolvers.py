import strawberry
from typing import List, Optional
from bson import ObjectId
from datetime import datetime
from app.database import get_db
from app.schema.types import (
    Region, MonthlyUpdate, PreSales, ActionPlan, OpenRole,
    UpcomingRelease, NewHire, BenchResource, Challenge,
    RegionInput, MonthlyUpdateInput, PreSalesInput, ActionPlanInput,
    OpenRoleInput, UpcomingReleaseInput, NewHireInput, BenchResourceInput,
    ChallengeInput, ReorderInput, DashboardData, AttritionTrend, RevenueTrend
)


def doc_to_dict(doc):
    """Convert MongoDB document to dict with string id."""
    if doc is None:
        return None
    doc["id"] = str(doc.pop("_id"))
    # Convert datetime fields to string
    for key in ["created_at", "updated_at"]:
        if key in doc and isinstance(doc[key], datetime):
            doc[key] = doc[key].isoformat()
    return doc


@strawberry.type
class Query:
    @strawberry.field
    async def regions(self, active_only: bool = True) -> List[Region]:
        db = get_db()
        query = {"is_active": True} if active_only else {}
        cursor = db.regions.find(query).sort("name", 1)
        results = []
        async for doc in cursor:
            results.append(Region(**doc_to_dict(doc)))
        return results

    @strawberry.field
    async def region(self, id: str) -> Optional[Region]:
        db = get_db()
        doc = await db.regions.find_one({"_id": ObjectId(id)})
        if doc:
            return Region(**doc_to_dict(doc))
        return None

    @strawberry.field
    async def monthly_update(self, region_id: str, month: str) -> Optional[MonthlyUpdate]:
        db = get_db()
        doc = await db.monthly_updates.find_one({"region_id": region_id, "month": month})
        if doc:
            return MonthlyUpdate(**doc_to_dict(doc))
        return None

    @strawberry.field
    async def pre_sales_list(self, region_id: str, month: str) -> List[PreSales]:
        db = get_db()
        cursor = db.pre_sales.find({"region_id": region_id, "month": month}).sort("display_order", 1)
        results = []
        async for doc in cursor:
            results.append(PreSales(**doc_to_dict(doc)))
        return results

    @strawberry.field
    async def action_plans(self, region_id: str, month: str) -> List[ActionPlan]:
        db = get_db()
        cursor = db.action_plans.find({"region_id": region_id, "month": month}).sort("display_order", 1)
        results = []
        async for doc in cursor:
            results.append(ActionPlan(**doc_to_dict(doc)))
        return results

    @strawberry.field
    async def open_roles(self, region_id: str, month: str) -> List[OpenRole]:
        db = get_db()
        cursor = db.open_roles.find({"region_id": region_id, "month": month}).sort("skill", 1)
        results = []
        async for doc in cursor:
            results.append(OpenRole(**doc_to_dict(doc)))
        return results

    @strawberry.field
    async def upcoming_releases(self, region_id: str, month: str) -> List[UpcomingRelease]:
        db = get_db()
        cursor = db.upcoming_releases.find({"region_id": region_id, "month": month}).sort("skill", 1)
        results = []
        async for doc in cursor:
            results.append(UpcomingRelease(**doc_to_dict(doc)))
        return results

    @strawberry.field
    async def new_hires(self, region_id: str, month: str) -> List[NewHire]:
        db = get_db()
        cursor = db.new_hires.find({"region_id": region_id, "month": month}).sort("skill", 1)
        results = []
        async for doc in cursor:
            results.append(NewHire(**doc_to_dict(doc)))
        return results

    @strawberry.field
    async def bench_resources(self, region_id: str, month: str) -> List[BenchResource]:
        db = get_db()
        cursor = db.bench_resources.find({"region_id": region_id, "month": month}).sort("skill", 1)
        results = []
        async for doc in cursor:
            results.append(BenchResource(**doc_to_dict(doc)))
        return results

    @strawberry.field
    async def challenges(self, region_id: str, month: str) -> List[Challenge]:
        db = get_db()
        cursor = db.challenges.find({"region_id": region_id, "month": month})
        results = []
        async for doc in cursor:
            results.append(Challenge(**doc_to_dict(doc)))
        return results

    @strawberry.field
    async def dashboard_data(self, region_id: str, month: str) -> DashboardData:
        db = get_db()

        update_doc = await db.monthly_updates.find_one({"region_id": region_id, "month": month})
        monthly_update = MonthlyUpdate(**doc_to_dict(update_doc)) if update_doc else None

        pre_sales = []
        async for doc in db.pre_sales.find({"region_id": region_id, "month": month}).sort("display_order", 1):
            pre_sales.append(PreSales(**doc_to_dict(doc)))

        action_plans_list = []
        async for doc in db.action_plans.find({"region_id": region_id, "month": month}).sort("display_order", 1):
            action_plans_list.append(ActionPlan(**doc_to_dict(doc)))

        open_roles_list = []
        async for doc in db.open_roles.find({"region_id": region_id, "month": month}).sort("skill", 1):
            open_roles_list.append(OpenRole(**doc_to_dict(doc)))

        releases = []
        async for doc in db.upcoming_releases.find({"region_id": region_id, "month": month}).sort("skill", 1):
            releases.append(UpcomingRelease(**doc_to_dict(doc)))

        hires = []
        async for doc in db.new_hires.find({"region_id": region_id, "month": month}).sort("skill", 1):
            hires.append(NewHire(**doc_to_dict(doc)))

        bench = []
        async for doc in db.bench_resources.find({"region_id": region_id, "month": month}).sort("skill", 1):
            bench.append(BenchResource(**doc_to_dict(doc)))

        challenges_list = []
        async for doc in db.challenges.find({"region_id": region_id, "month": month}):
            challenges_list.append(Challenge(**doc_to_dict(doc)))

        return DashboardData(
            monthly_update=monthly_update,
            pre_sales=pre_sales,
            action_plans=action_plans_list,
            open_roles=open_roles_list,
            upcoming_releases=releases,
            new_hires=hires,
            bench_resources=bench,
            challenges=challenges_list,
        )

    @strawberry.field
    async def attrition_trends(self, region_id: str, months: int = 6) -> List[AttritionTrend]:
        db = get_db()
        cursor = db.monthly_updates.find(
            {"region_id": region_id}
        ).sort("month", -1).limit(months)
        results = []
        async for doc in cursor:
            results.append(AttritionTrend(
                month=doc["month"],
                attrition_rate=doc.get("attrition_rate", 0),
                total_headcount=doc.get("total_headcount", 0)
            ))
        results.reverse()
        return results

    @strawberry.field
    async def revenue_trends(self, region_id: str, months: int = 6) -> List[RevenueTrend]:
        db = get_db()
        cursor = db.monthly_updates.find(
            {"region_id": region_id}
        ).sort("month", -1).limit(months)
        results = []
        async for doc in cursor:
            results.append(RevenueTrend(
                month=doc["month"],
                revenue=doc.get("revenue", 0),
                margin=doc.get("margin", 0)
            ))
        results.reverse()
        return results


@strawberry.type
class Mutation:
    # ---- Region ----
    @strawberry.mutation
    async def create_region(self, input: RegionInput) -> Region:
        db = get_db()
        doc = {
            "name": input.name,
            "code": input.code,
            "is_active": input.is_active,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow(),
        }
        result = await db.regions.insert_one(doc)
        doc["_id"] = result.inserted_id
        return Region(**doc_to_dict(doc))

    @strawberry.mutation
    async def update_region(self, id: str, input: RegionInput) -> Region:
        db = get_db()
        update = {
            "name": input.name,
            "code": input.code,
            "is_active": input.is_active,
            "updated_at": datetime.utcnow(),
        }
        await db.regions.update_one({"_id": ObjectId(id)}, {"$set": update})
        doc = await db.regions.find_one({"_id": ObjectId(id)})
        return Region(**doc_to_dict(doc))

    @strawberry.mutation
    async def delete_region(self, id: str) -> bool:
        db = get_db()
        result = await db.regions.delete_one({"_id": ObjectId(id)})
        return result.deleted_count > 0

    # ---- Monthly Update ----
    @strawberry.mutation
    async def upsert_monthly_update(self, input: MonthlyUpdateInput) -> MonthlyUpdate:
        db = get_db()
        doc = {
            "region_id": input.region_id,
            "month": input.month,
            "revenue": input.revenue,
            "margin": input.margin,
            "total_headcount": input.total_headcount,
            "billable_headcount": input.billable_headcount,
            "non_billable_headcount": input.non_billable_headcount,
            "male_count": input.male_count,
            "female_count": input.female_count,
            "other_gender_count": input.other_gender_count,
            "attrition_rate": input.attrition_rate,
            "upskill_count": input.upskill_count,
            "updated_at": datetime.utcnow(),
        }
        result = await db.monthly_updates.update_one(
            {"region_id": input.region_id, "month": input.month},
            {"$set": doc, "$setOnInsert": {"created_at": datetime.utcnow()}},
            upsert=True
        )
        saved = await db.monthly_updates.find_one({"region_id": input.region_id, "month": input.month})
        return MonthlyUpdate(**doc_to_dict(saved))

    # ---- PreSales ----
    @strawberry.mutation
    async def create_pre_sales(self, input: PreSalesInput) -> PreSales:
        db = get_db()
        doc = {
            "region_id": input.region_id,
            "month": input.month,
            "type": input.type,
            "title": input.title,
            "client": input.client,
            "status": input.status,
            "value": input.value,
            "display_order": input.display_order,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow(),
        }
        result = await db.pre_sales.insert_one(doc)
        doc["_id"] = result.inserted_id
        return PreSales(**doc_to_dict(doc))

    @strawberry.mutation
    async def update_pre_sales(self, id: str, input: PreSalesInput) -> PreSales:
        db = get_db()
        update = {
            "type": input.type,
            "title": input.title,
            "client": input.client,
            "status": input.status,
            "value": input.value,
            "display_order": input.display_order,
            "updated_at": datetime.utcnow(),
        }
        await db.pre_sales.update_one({"_id": ObjectId(id)}, {"$set": update})
        doc = await db.pre_sales.find_one({"_id": ObjectId(id)})
        return PreSales(**doc_to_dict(doc))

    @strawberry.mutation
    async def delete_pre_sales(self, id: str) -> bool:
        db = get_db()
        result = await db.pre_sales.delete_one({"_id": ObjectId(id)})
        return result.deleted_count > 0

    @strawberry.mutation
    async def reorder_pre_sales(self, items: List[ReorderInput]) -> bool:
        db = get_db()
        for item in items:
            await db.pre_sales.update_one(
                {"_id": ObjectId(item.id)},
                {"$set": {"display_order": item.display_order, "updated_at": datetime.utcnow()}}
            )
        return True

    # ---- Action Plans ----
    @strawberry.mutation
    async def create_action_plan(self, input: ActionPlanInput) -> ActionPlan:
        db = get_db()
        doc = {
            "region_id": input.region_id,
            "month": input.month,
            "action_item": input.action_item,
            "assigned_to": input.assigned_to,
            "due_date": input.due_date,
            "status": input.status,
            "priority": input.priority,
            "display_order": input.display_order,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow(),
        }
        result = await db.action_plans.insert_one(doc)
        doc["_id"] = result.inserted_id
        return ActionPlan(**doc_to_dict(doc))

    @strawberry.mutation
    async def update_action_plan(self, id: str, input: ActionPlanInput) -> ActionPlan:
        db = get_db()
        update = {
            "action_item": input.action_item,
            "assigned_to": input.assigned_to,
            "due_date": input.due_date,
            "status": input.status,
            "priority": input.priority,
            "display_order": input.display_order,
            "updated_at": datetime.utcnow(),
        }
        await db.action_plans.update_one({"_id": ObjectId(id)}, {"$set": update})
        doc = await db.action_plans.find_one({"_id": ObjectId(id)})
        return ActionPlan(**doc_to_dict(doc))

    @strawberry.mutation
    async def delete_action_plan(self, id: str) -> bool:
        db = get_db()
        result = await db.action_plans.delete_one({"_id": ObjectId(id)})
        return result.deleted_count > 0

    @strawberry.mutation
    async def reorder_action_plans(self, items: List[ReorderInput]) -> bool:
        db = get_db()
        for item in items:
            await db.action_plans.update_one(
                {"_id": ObjectId(item.id)},
                {"$set": {"display_order": item.display_order, "updated_at": datetime.utcnow()}}
            )
        return True

    # ---- Open Roles ----
    @strawberry.mutation
    async def create_open_role(self, input: OpenRoleInput) -> OpenRole:
        db = get_db()
        doc = {
            "region_id": input.region_id,
            "month": input.month,
            "skill": input.skill,
            "account": input.account,
            "location": input.location,
            "count": input.count,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow(),
        }
        result = await db.open_roles.insert_one(doc)
        doc["_id"] = result.inserted_id
        return OpenRole(**doc_to_dict(doc))

    @strawberry.mutation
    async def update_open_role(self, id: str, input: OpenRoleInput) -> OpenRole:
        db = get_db()
        update = {
            "skill": input.skill,
            "account": input.account,
            "location": input.location,
            "count": input.count,
            "updated_at": datetime.utcnow(),
        }
        await db.open_roles.update_one({"_id": ObjectId(id)}, {"$set": update})
        doc = await db.open_roles.find_one({"_id": ObjectId(id)})
        return OpenRole(**doc_to_dict(doc))

    @strawberry.mutation
    async def delete_open_role(self, id: str) -> bool:
        db = get_db()
        result = await db.open_roles.delete_one({"_id": ObjectId(id)})
        return result.deleted_count > 0

    # ---- Upcoming Releases ----
    @strawberry.mutation
    async def create_upcoming_release(self, input: UpcomingReleaseInput) -> UpcomingRelease:
        db = get_db()
        doc = {
            "region_id": input.region_id,
            "month": input.month,
            "skill": input.skill,
            "account": input.account,
            "location": input.location,
            "count": input.count,
            "release_date": input.release_date,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow(),
        }
        result = await db.upcoming_releases.insert_one(doc)
        doc["_id"] = result.inserted_id
        return UpcomingRelease(**doc_to_dict(doc))

    @strawberry.mutation
    async def update_upcoming_release(self, id: str, input: UpcomingReleaseInput) -> UpcomingRelease:
        db = get_db()
        update = {
            "skill": input.skill,
            "account": input.account,
            "location": input.location,
            "count": input.count,
            "release_date": input.release_date,
            "updated_at": datetime.utcnow(),
        }
        await db.upcoming_releases.update_one({"_id": ObjectId(id)}, {"$set": update})
        doc = await db.upcoming_releases.find_one({"_id": ObjectId(id)})
        return UpcomingRelease(**doc_to_dict(doc))

    @strawberry.mutation
    async def delete_upcoming_release(self, id: str) -> bool:
        db = get_db()
        result = await db.upcoming_releases.delete_one({"_id": ObjectId(id)})
        return result.deleted_count > 0

    # ---- New Hires ----
    @strawberry.mutation
    async def create_new_hire(self, input: NewHireInput) -> NewHire:
        db = get_db()
        doc = {
            "region_id": input.region_id,
            "month": input.month,
            "skill": input.skill,
            "account": input.account,
            "location": input.location,
            "count": input.count,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow(),
        }
        result = await db.new_hires.insert_one(doc)
        doc["_id"] = result.inserted_id
        return NewHire(**doc_to_dict(doc))

    @strawberry.mutation
    async def update_new_hire(self, id: str, input: NewHireInput) -> NewHire:
        db = get_db()
        update = {
            "skill": input.skill,
            "account": input.account,
            "location": input.location,
            "count": input.count,
            "updated_at": datetime.utcnow(),
        }
        await db.new_hires.update_one({"_id": ObjectId(id)}, {"$set": update})
        doc = await db.new_hires.find_one({"_id": ObjectId(id)})
        return NewHire(**doc_to_dict(doc))

    @strawberry.mutation
    async def delete_new_hire(self, id: str) -> bool:
        db = get_db()
        result = await db.new_hires.delete_one({"_id": ObjectId(id)})
        return result.deleted_count > 0

    # ---- Bench Resources ----
    @strawberry.mutation
    async def create_bench_resource(self, input: BenchResourceInput) -> BenchResource:
        db = get_db()
        doc = {
            "region_id": input.region_id,
            "month": input.month,
            "skill": input.skill,
            "account": input.account,
            "location": input.location,
            "count": input.count,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow(),
        }
        result = await db.bench_resources.insert_one(doc)
        doc["_id"] = result.inserted_id
        return BenchResource(**doc_to_dict(doc))

    @strawberry.mutation
    async def update_bench_resource(self, id: str, input: BenchResourceInput) -> BenchResource:
        db = get_db()
        update = {
            "skill": input.skill,
            "account": input.account,
            "location": input.location,
            "count": input.count,
            "updated_at": datetime.utcnow(),
        }
        await db.bench_resources.update_one({"_id": ObjectId(id)}, {"$set": update})
        doc = await db.bench_resources.find_one({"_id": ObjectId(id)})
        return BenchResource(**doc_to_dict(doc))

    @strawberry.mutation
    async def delete_bench_resource(self, id: str) -> bool:
        db = get_db()
        result = await db.bench_resources.delete_one({"_id": ObjectId(id)})
        return result.deleted_count > 0

    # ---- Challenges ----
    @strawberry.mutation
    async def create_challenge(self, input: ChallengeInput) -> Challenge:
        db = get_db()
        doc = {
            "region_id": input.region_id,
            "month": input.month,
            "title": input.title,
            "description": input.description,
            "severity": input.severity,
            "mitigation": input.mitigation,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow(),
        }
        result = await db.challenges.insert_one(doc)
        doc["_id"] = result.inserted_id
        return Challenge(**doc_to_dict(doc))

    @strawberry.mutation
    async def update_challenge(self, id: str, input: ChallengeInput) -> Challenge:
        db = get_db()
        update = {
            "title": input.title,
            "description": input.description,
            "severity": input.severity,
            "mitigation": input.mitigation,
            "updated_at": datetime.utcnow(),
        }
        await db.challenges.update_one({"_id": ObjectId(id)}, {"$set": update})
        doc = await db.challenges.find_one({"_id": ObjectId(id)})
        return Challenge(**doc_to_dict(doc))

    @strawberry.mutation
    async def delete_challenge(self, id: str) -> bool:
        db = get_db()
        result = await db.challenges.delete_one({"_id": ObjectId(id)})
        return result.deleted_count > 0


schema = strawberry.Schema(query=Query, mutation=Mutation)
