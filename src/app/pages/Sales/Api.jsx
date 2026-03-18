import { createQueryString } from "app/services/SharedData";
import REQUEST from "../../services/Request";
import { GET_USERS } from "../Admins/Api";

// Get sales users (using GET_USERS with role=Sales)
export const GET_SALES = async (data) => {
  const queryData = {
    ...data,
    role: "Sales"
  };
  return await GET_USERS(queryData);
};

// Get users with role User (for assigning as leads)
export const GET_USER_LEADS = async (data) => {
  const queryData = {
    ...data,
    role: "User"
  };
  return await GET_USERS(queryData);
};

// LeadStatus enum: 0 = Interested, 1 = NotInterested, 2 = CallHimBack
export const LEAD_STATUS = {
  Interested: 0,
  NotInterested: 1,
  CallHimBack: 2,
};

export const LEAD_STATUS_LABELS = {
  [LEAD_STATUS.Interested]: "Interested",
  [LEAD_STATUS.NotInterested]: "Not Interested",
  [LEAD_STATUS.CallHimBack]: "Call Him Back",
};

// Get sales leads for a specific sales user
export const GET_SALES_LEADS = async (salesId, data = {}) => {
  return await REQUEST({
    method: "GET",
    url: `Leads/sales/${salesId}?` + createQueryString(data),
  });
};

// Get all leads (for selection in edit popup)
export const GET_ALL_LEADS = async (data = {}) => {
  return await REQUEST({
    method: "GET",
    url: "Leads?" + createQueryString(data),
  });
};

// Add single lead
export const ADD_LEAD = async (data) => {
  return await REQUEST({
    method: "POST",
    url: "Leads",
    data: {
      name: data.name,
      email: data.email,
      phoneNumber: data.phoneNumber ?? undefined,
      address: data.address ?? undefined,
      dateOfBirth: data.dateOfBirth ?? undefined,
      occupation: data.occupation ?? undefined,
      monthlyIncome: data.monthlyIncome ?? undefined,
      note: data.note ?? undefined,
      leadStatus: data.leadStatus ?? undefined,
      salesId: data.salesId,
    },
  });
};

// Add multiple leads
export const ADD_LEADS_LIST = async (leads) => {
  return await REQUEST({
    method: "POST",
    url: "Leads/list",
    data: {
      leads: leads.map((lead) => ({
        name: lead.name,
        email: lead.email,
        phoneNumber: lead.phoneNumber ?? undefined,
        address: lead.address ?? undefined,
        dateOfBirth: lead.dateOfBirth ?? undefined,
        occupation: lead.occupation ?? undefined,
        monthlyIncome: lead.monthlyIncome ?? undefined,
        note: lead.note ?? undefined,
        leadStatus: lead.leadStatus ?? undefined,
        salesId: lead.salesId,
      })),
    },
  });
};

// Update lead (note and/or leadStatus)
export const UPDATE_LEAD = async (leadUserId, data) => {
  return await REQUEST({
    method: "PUT",
    url: `Leads/${leadUserId}`,
    data: {
      ...(data.note !== undefined && { note: data.note }),
      ...(data.leadStatus !== undefined && { leadStatus: data.leadStatus }),
    },
  });
};

// Delete single lead
export const DELETE_LEAD = async (leadUserId) => {
  return await REQUEST({
    method: "DELETE",
    url: `Leads/${leadUserId}`,
  });
};

// Delete multiple leads
export const DELETE_LEADS_LIST = async (leadUserIds) => {
  return await REQUEST({
    method: "POST",
    url: "Leads/delete-list",
    data: {
      leadUserIds: Array.isArray(leadUserIds) ? leadUserIds : [leadUserIds],
    },
  });
};

// Assign leads to a sales user
export const ASSIGN_LEADS = async (salesId, leadIds) => {
  return await REQUEST({
    method: "POST",
    url: "Leads/assign",
    data: {
      salesId: salesId,
      leadUserIds: Array.isArray(leadIds) ? leadIds : [leadIds]
    },
  });
};

// Upload Excel file to create users
export const UPLOAD_EXCEL = async (file, salesId = null) => {
  const formData = new FormData();
  formData.append('file', file);
  
  if (salesId) {
    formData.append('salesId', salesId.toString());
  }

  return await REQUEST({
    method: "POST",
    url: "Leads/upload-excel",
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
};

