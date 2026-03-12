import { gql } from '@apollo/client';

// ---- QUERIES ----
export const GET_REGIONS = gql`
  query GetRegions($activeOnly: Boolean!) {
    regions(activeOnly: $activeOnly) {
      id name code isActive
    }
  }
`;

export const GET_DASHBOARD_DATA = gql`
  query GetDashboardData($regionId: String!, $month: String!) {
    dashboardData(regionId: $regionId, month: $month) {
      monthlyUpdate {
        id regionId month revenue margin
        totalHeadcount billableHeadcount nonBillableHeadcount
        maleCount femaleCount otherGenderCount
        attritionRate upskillCount
      }
      preSales {
        id type title client status value displayOrder
      }
      actionPlans {
        id actionItem assignedTo dueDate status priority displayOrder
      }
      openRoles {
        id skill account location count
      }
      upcomingReleases {
        id skill account location count releaseDate
      }
      newHires {
        id skill account location count
      }
      benchResources {
        id skill account location count
      }
      challenges {
        id title description severity mitigation
      }
    }
  }
`;

export const GET_ATTRITION_TRENDS = gql`
  query GetAttritionTrends($regionId: String!, $months: Int!) {
    attritionTrends(regionId: $regionId, months: $months) {
      month attritionRate totalHeadcount
    }
  }
`;

export const GET_REVENUE_TRENDS = gql`
  query GetRevenueTrends($regionId: String!, $months: Int!) {
    revenueTrends(regionId: $regionId, months: $months) {
      month revenue margin
    }
  }
`;

export const GET_MONTHLY_UPDATE = gql`
  query GetMonthlyUpdate($regionId: String!, $month: String!) {
    monthlyUpdate(regionId: $regionId, month: $month) {
      id regionId month revenue margin
      totalHeadcount billableHeadcount nonBillableHeadcount
      maleCount femaleCount otherGenderCount
      attritionRate upskillCount
    }
  }
`;

export const GET_PRE_SALES_LIST = gql`
  query GetPreSalesList($regionId: String!, $month: String!) {
    preSalesList(regionId: $regionId, month: $month) {
      id regionId month type title client status value displayOrder
    }
  }
`;

export const GET_ACTION_PLANS = gql`
  query GetActionPlans($regionId: String!, $month: String!) {
    actionPlans(regionId: $regionId, month: $month) {
      id regionId month actionItem assignedTo dueDate status priority displayOrder
    }
  }
`;

export const GET_OPEN_ROLES = gql`
  query GetOpenRoles($regionId: String!, $month: String!) {
    openRoles(regionId: $regionId, month: $month) {
      id regionId month skill account location count
    }
  }
`;

export const GET_UPCOMING_RELEASES = gql`
  query GetUpcomingReleases($regionId: String!, $month: String!) {
    upcomingReleases(regionId: $regionId, month: $month) {
      id regionId month skill account location count releaseDate
    }
  }
`;

export const GET_NEW_HIRES = gql`
  query GetNewHires($regionId: String!, $month: String!) {
    newHires(regionId: $regionId, month: $month) {
      id regionId month skill account location count
    }
  }
`;

export const GET_BENCH_RESOURCES = gql`
  query GetBenchResources($regionId: String!, $month: String!) {
    benchResources(regionId: $regionId, month: $month) {
      id regionId month skill account location count
    }
  }
`;

export const GET_CHALLENGES = gql`
  query GetChallenges($regionId: String!, $month: String!) {
    challenges(regionId: $regionId, month: $month) {
      id regionId month title description severity mitigation
    }
  }
`;

// ---- MUTATIONS ----
export const CREATE_REGION = gql`
  mutation CreateRegion($input: RegionInput!) {
    createRegion(input: $input) { id name code isActive }
  }
`;

export const UPDATE_REGION = gql`
  mutation UpdateRegion($id: String!, $input: RegionInput!) {
    updateRegion(id: $id, input: $input) { id name code isActive }
  }
`;

export const DELETE_REGION = gql`
  mutation DeleteRegion($id: String!) {
    deleteRegion(id: $id)
  }
`;

export const UPSERT_MONTHLY_UPDATE = gql`
  mutation UpsertMonthlyUpdate($input: MonthlyUpdateInput!) {
    upsertMonthlyUpdate(input: $input) {
      id regionId month revenue margin
      totalHeadcount billableHeadcount nonBillableHeadcount
      maleCount femaleCount otherGenderCount
      attritionRate upskillCount
    }
  }
`;

export const CREATE_PRE_SALES = gql`
  mutation CreatePreSales($input: PreSalesInput!) {
    createPreSales(input: $input) { id type title client status value displayOrder }
  }
`;

export const UPDATE_PRE_SALES = gql`
  mutation UpdatePreSales($id: String!, $input: PreSalesInput!) {
    updatePreSales(id: $id, input: $input) { id type title client status value displayOrder }
  }
`;

export const DELETE_PRE_SALES = gql`
  mutation DeletePreSales($id: String!) {
    deletePreSales(id: $id)
  }
`;

export const REORDER_PRE_SALES = gql`
  mutation ReorderPreSales($items: [ReorderInput!]!) {
    reorderPreSales(items: $items)
  }
`;

export const CREATE_ACTION_PLAN = gql`
  mutation CreateActionPlan($input: ActionPlanInput!) {
    createActionPlan(input: $input) { id actionItem assignedTo dueDate status priority displayOrder }
  }
`;

export const UPDATE_ACTION_PLAN = gql`
  mutation UpdateActionPlan($id: String!, $input: ActionPlanInput!) {
    updateActionPlan(id: $id, input: $input) { id actionItem assignedTo dueDate status priority displayOrder }
  }
`;

export const DELETE_ACTION_PLAN = gql`
  mutation DeleteActionPlan($id: String!) {
    deleteActionPlan(id: $id)
  }
`;

export const REORDER_ACTION_PLANS = gql`
  mutation ReorderActionPlans($items: [ReorderInput!]!) {
    reorderActionPlans(items: $items)
  }
`;

export const CREATE_OPEN_ROLE = gql`
  mutation CreateOpenRole($input: OpenRoleInput!) {
    createOpenRole(input: $input) { id skill account location count }
  }
`;

export const UPDATE_OPEN_ROLE = gql`
  mutation UpdateOpenRole($id: String!, $input: OpenRoleInput!) {
    updateOpenRole(id: $id, input: $input) { id skill account location count }
  }
`;

export const DELETE_OPEN_ROLE = gql`
  mutation DeleteOpenRole($id: String!) {
    deleteOpenRole(id: $id)
  }
`;

export const CREATE_UPCOMING_RELEASE = gql`
  mutation CreateUpcomingRelease($input: UpcomingReleaseInput!) {
    createUpcomingRelease(input: $input) { id skill account location count releaseDate }
  }
`;

export const UPDATE_UPCOMING_RELEASE = gql`
  mutation UpdateUpcomingRelease($id: String!, $input: UpcomingReleaseInput!) {
    updateUpcomingRelease(id: $id, input: $input) { id skill account location count releaseDate }
  }
`;

export const DELETE_UPCOMING_RELEASE = gql`
  mutation DeleteUpcomingRelease($id: String!) {
    deleteUpcomingRelease(id: $id)
  }
`;

export const CREATE_NEW_HIRE = gql`
  mutation CreateNewHire($input: NewHireInput!) {
    createNewHire(input: $input) { id skill account location count }
  }
`;

export const UPDATE_NEW_HIRE = gql`
  mutation UpdateNewHire($id: String!, $input: NewHireInput!) {
    updateNewHire(id: $id, input: $input) { id skill account location count }
  }
`;

export const DELETE_NEW_HIRE = gql`
  mutation DeleteNewHire($id: String!) {
    deleteNewHire(id: $id)
  }
`;

export const CREATE_BENCH_RESOURCE = gql`
  mutation CreateBenchResource($input: BenchResourceInput!) {
    createBenchResource(input: $input) { id skill account location count }
  }
`;

export const UPDATE_BENCH_RESOURCE = gql`
  mutation UpdateBenchResource($id: String!, $input: BenchResourceInput!) {
    updateBenchResource(id: $id, input: $input) { id skill account location count }
  }
`;

export const DELETE_BENCH_RESOURCE = gql`
  mutation DeleteBenchResource($id: String!) {
    deleteBenchResource(id: $id)
  }
`;

export const CREATE_CHALLENGE = gql`
  mutation CreateChallenge($input: ChallengeInput!) {
    createChallenge(input: $input) { id title description severity mitigation }
  }
`;

export const UPDATE_CHALLENGE = gql`
  mutation UpdateChallenge($id: String!, $input: ChallengeInput!) {
    updateChallenge(id: $id, input: $input) { id title description severity mitigation }
  }
`;

export const DELETE_CHALLENGE = gql`
  mutation DeleteChallenge($id: String!) {
    deleteChallenge(id: $id)
  }
`;
