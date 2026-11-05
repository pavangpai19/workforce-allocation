import { RankedCandidate, Project, Employee, AllocationDecisionLog } from '../types/workforce';
import { supabase } from './supabaseClient';

const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:3001';

export interface LoginResponse {
  success: boolean;
  access_token: string;
  user: {
    authUserId: string;
    employeeId: string;
    role: 'ADMIN' | 'MANAGER' | 'EMPLOYEE';
    email: string;
    name: string;
  };
}

export interface AutoAllocateRequest {
  project_id: string;
  skill: string;
  required_hours: number;
  week_start_date?: string;
}

export interface SelectedCandidateProposal {
  employee_id: string;
  employee_name: string;
  final_score: number;
  fairness_score: number;
  performance_score: number;
  skill_score: number;
  knowledge_score: number;
  risk_score: number;
  confidence: number;
}

export interface RankedCandidateProposal {
  employee_id: string;
  employee_name: string;
  final_score: number;
  fairness_score: number;
  performance_score: number;
  skill_score: number;
  knowledge_score: number;
  risk_score: number;
  confidence: number;
  remaining_hours: number;
}

export interface AllocationProposal {
  status: 'SUCCESS' | 'FAILED';
  selected_candidate: SelectedCandidateProposal;
  ranked_candidates: RankedCandidateProposal[];
  explanation: string;
  allocation_id: string;
}

class ApiService {
  private getToken(): string | null {
    return localStorage.getItem('wf_access_token');
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const token = this.getToken();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers,
      });

      if (!response.ok) {
        // Only 401 triggers session invalidation and login redirect
        if (response.status === 401) {
          console.warn('[API] 401 Unauthorized encountered. Invalidating session.');
          await supabase.auth.signOut();
          window.location.href = '/login';
        }

        const errBody = await response.json().catch(() => ({}));
        throw new Error(errBody.message || `Request failed with status ${response.status}`);
      }

      return await response.json();
    } catch (err: any) {
      // 404, 500, or network offline errors are logged and thrown without redirecting to login
      console.warn(`[API] Error on ${endpoint}:`, err.message);
      throw err;
    }
  }

  // Auth endpoints
  async login(email: string, password: string): Promise<LoginResponse> {
    return this.request<LoginResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async getMe(): Promise<any> {
    return this.request<any>('/auth/me');
  }

  // Allocations Auto-Allocation
  async triggerAutoAllocation(payload: AutoAllocateRequest): Promise<AllocationProposal> {
    return this.request<AllocationProposal>('/allocations/auto', {
      method: 'POST',
      body: JSON.stringify({
        project_id: payload.project_id,
        skill: payload.skill,
        required_hours: payload.required_hours,
        week_start_date: payload.week_start_date || new Date().toISOString().split('T')[0],
      }),
    });
  }

  // Projects & Employees
  async getProjects(): Promise<Project[]> {
    return this.request<Project[]>('/projects');
  }

  async getProject(id: string): Promise<any> {
    return this.request<any>(`/projects/${id}`);
  }

  async createProject(projectData: any): Promise<any> {
    return this.request<any>('/projects', {
      method: 'POST',
      body: JSON.stringify(projectData),
    });
  }

  async getEmployees(): Promise<Employee[]> {
    return this.request<Employee[]>('/employees');
  }

  async getEmployee(id: string): Promise<any> {
    return this.request<any>(`/employees/${id}`);
  }

  async getEmployeeWorkload(): Promise<any[]> {
    return this.request<any[]>('/employees/workload');
  }

  // Allocations & Proposals
  async getMyAllocations(): Promise<any[]> {
    return this.request<any[]>('/allocations/my');
  }

  async getAllocations(): Promise<any[]> {
    return this.request<any[]>('/allocations');
  }

  async getProposals(status?: string): Promise<any[]> {
    return this.request<any[]>(status ? `/allocation-proposals?status=${status}` : '/allocation-proposals');
  }

  async getProposal(id: string): Promise<any> {
    return this.request<any>(`/allocation-proposals/${id}`);
  }

  async approveProposal(id: string, dto: { manager_id?: string; review_comment?: string } = {}): Promise<any> {
    return this.request<any>(`/allocation-proposals/${id}/approve`, {
      method: 'POST',
      body: JSON.stringify(dto),
    });
  }

  async rejectProposal(id: string, dto: { manager_id?: string; review_comment?: string } = {}): Promise<any> {
    return this.request<any>(`/allocation-proposals/${id}/reject`, {
      method: 'POST',
      body: JSON.stringify(dto),
    });
  }

  async generateTeamProposal(payload: { project_id: string; max_candidates_per_role?: number; include_fairness_adjustment?: boolean }): Promise<any> {
    return this.request<any>('/team-formation/generate', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  // Phase 1C: Release & Completion reporting
  async reportWorkCompletion(allocationId: string, completionData: any): Promise<any> {
    return this.request<any>(`/allocations/release/${allocationId}/complete`, {
      method: 'POST',
      body: JSON.stringify(completionData),
    });
  }
}

export const api = new ApiService();
