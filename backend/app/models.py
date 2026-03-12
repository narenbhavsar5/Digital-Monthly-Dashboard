from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime, date


class RegionModel(BaseModel):
    id: Optional[str] = Field(None, alias="_id")
    name: str
    code: str
    is_active: bool = True


    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)


class MonthlyUpdateModel(BaseModel):
    id: Optional[str] = Field(None, alias="_id")
    region_id: str
    month: str  # YYYY-MM
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
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)


class PreSalesModel(BaseModel):
    id: Optional[str] = Field(None, alias="_id")
    region_id: str
    month: str
    type: str  # RFP or Proposal
    title: str
    client: str
    status: str  # Won, Lost, In Progress, Submitted
    value: float = 0.0
    display_order: int = 0
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)


class ActionPlanModel(BaseModel):
    id: Optional[str] = Field(None, alias="_id")
    region_id: str
    month: str
    action_item: str
    assigned_to: str = ""
    due_date: Optional[str] = None
    status: str = "Not Started"  # Not Started, In Progress, Completed, Delayed
    priority: str = "Medium"  # Low, Medium, High, Critical
    display_order: int = 0
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)


class OpenRoleModel(BaseModel):
    id: Optional[str] = Field(None, alias="_id")
    region_id: str
    month: str
    skill: str
    account: str
    location: str
    count: int = 1
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)


class UpcomingReleaseModel(BaseModel):
    id: Optional[str] = Field(None, alias="_id")
    region_id: str
    month: str
    skill: str
    account: str
    location: str
    count: int = 1
    release_date: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)


class NewHireModel(BaseModel):
    id: Optional[str] = Field(None, alias="_id")
    region_id: str
    month: str
    skill: str
    account: str
    location: str
    count: int = 1
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)


class BenchResourceModel(BaseModel):
    id: Optional[str] = Field(None, alias="_id")
    region_id: str
    month: str
    skill: str
    account: str
    location: str
    count: int = 1
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)


class ChallengeModel(BaseModel):
    id: Optional[str] = Field(None, alias="_id")
    region_id: str
    month: str
    title: str
    description: str = ""
    severity: str = "Medium"  # Low, Medium, High, Critical
    mitigation: str = ""
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
