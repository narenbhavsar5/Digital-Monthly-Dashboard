import strawberry
from typing import Optional, List
from datetime import datetime


@strawberry.type
class Region:
    id: str
    name: str
    code: str
    is_active: bool
    created_at: Optional[str] = None
    updated_at: Optional[str] = None


@strawberry.type
class MonthlyUpdate:
    id: str
    region_id: str
    month: str
    revenue: float
    margin: float
    total_headcount: int
    billable_headcount: int
    non_billable_headcount: int
    male_count: int
    female_count: int
    other_gender_count: int
    attrition_rate: float
    upskill_count: int
    created_at: Optional[str] = None
    updated_at: Optional[str] = None


@strawberry.type
class PreSales:
    id: str
    region_id: str
    month: str
    type: str
    title: str
    client: str
    status: str
    value: float
    display_order: int
    created_at: Optional[str] = None
    updated_at: Optional[str] = None


@strawberry.type
class ActionPlan:
    id: str
    region_id: str
    month: str
    action_item: str
    assigned_to: str
    due_date: Optional[str]
    status: str
    priority: str
    display_order: int
    created_at: Optional[str] = None
    updated_at: Optional[str] = None


@strawberry.type
class OpenRole:
    id: str
    region_id: str
    month: str
    skill: str
    account: str
    location: str
    count: int
    created_at: Optional[str] = None
    updated_at: Optional[str] = None


@strawberry.type
class UpcomingRelease:
    id: str
    region_id: str
    month: str
    skill: str
    account: str
    location: str
    count: int
    release_date: Optional[str]
    created_at: Optional[str] = None
    updated_at: Optional[str] = None


@strawberry.type
class NewHire:
    id: str
    region_id: str
    month: str
    skill: str
    account: str
    location: str
    count: int
    created_at: Optional[str] = None
    updated_at: Optional[str] = None


@strawberry.type
class BenchResource:
    id: str
    region_id: str
    month: str
    skill: str
    account: str
    location: str
    count: int
    created_at: Optional[str] = None
    updated_at: Optional[str] = None


@strawberry.type
class Challenge:
    id: str
    region_id: str
    month: str
    title: str
    description: str
    severity: str
    mitigation: str
    created_at: Optional[str] = None
    updated_at: Optional[str] = None


# ---- Input Types ----

@strawberry.input
class RegionInput:
    name: str
    code: str
    is_active: bool = True


@strawberry.input
class MonthlyUpdateInput:
    region_id: str
    month: str
    revenue: float = 0.0
    margin: float = 0.0
    total_headcount: int = 0
    billable_headcount: int = 0
    non_billable_headcount: int = 0
    male_count: int = 0
    female_count: int = 0
    other_gender_count: int = 0
    attrition_rate: float = 0.0
    upskill_count: int = 0


@strawberry.input
class PreSalesInput:
    region_id: str
    month: str
    type: str
    title: str
    client: str
    status: str
    value: float = 0.0
    display_order: int = 0


@strawberry.input
class ActionPlanInput:
    region_id: str
    month: str
    action_item: str
    assigned_to: str = ""
    due_date: Optional[str] = None
    status: str = "Not Started"
    priority: str = "Medium"
    display_order: int = 0


@strawberry.input
class OpenRoleInput:
    region_id: str
    month: str
    skill: str
    account: str
    location: str
    count: int = 1


@strawberry.input
class UpcomingReleaseInput:
    region_id: str
    month: str
    skill: str
    account: str
    location: str
    count: int = 1
    release_date: Optional[str] = None


@strawberry.input
class NewHireInput:
    region_id: str
    month: str
    skill: str
    account: str
    location: str
    count: int = 1


@strawberry.input
class BenchResourceInput:
    region_id: str
    month: str
    skill: str
    account: str
    location: str
    count: int = 1


@strawberry.input
class ChallengeInput:
    region_id: str
    month: str
    title: str
    description: str = ""
    severity: str = "Medium"
    mitigation: str = ""


@strawberry.input
class ReorderInput:
    id: str
    display_order: int


@strawberry.type
class DashboardData:
    monthly_update: Optional[MonthlyUpdate]
    pre_sales: List[PreSales]
    action_plans: List[ActionPlan]
    open_roles: List[OpenRole]
    upcoming_releases: List[UpcomingRelease]
    new_hires: List[NewHire]
    bench_resources: List[BenchResource]
    challenges: List[Challenge]


@strawberry.type
class AttritionTrend:
    month: str
    attrition_rate: float
    total_headcount: int


@strawberry.type
class RevenueTrend:
    month: str
    revenue: float
    margin: float
