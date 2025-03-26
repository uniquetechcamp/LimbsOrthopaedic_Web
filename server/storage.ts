import { 
  users, 
  User, 
  InsertUser, 
  appointments, 
  Appointment, 
  InsertAppointment,
  treatmentStages,
  TreatmentStage,
  InsertTreatmentStage,
  profiles,
  Profile,
  InsertProfile
} from "@shared/schema";

// Storage interface
export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getAllUsers(): Promise<User[]>;
  createUser(user: InsertUser): Promise<User>;
  
  // Profile operations
  getUserProfile(userId: number): Promise<Profile | undefined>;
  createOrUpdateProfile(profile: InsertProfile): Promise<Profile>;
  
  // Appointment operations
  getAppointment(id: number): Promise<Appointment | undefined>;
  getAllAppointments(): Promise<Appointment[]>;
  getUserAppointments(userId: number): Promise<Appointment[]>;
  createAppointment(appointment: InsertAppointment): Promise<Appointment>;
  updateAppointmentStatus(id: number, status: string): Promise<Appointment | undefined>;
  
  // Treatment stage operations
  getTreatmentStage(id: number): Promise<TreatmentStage | undefined>;
  getAllTreatmentStages(): Promise<TreatmentStage[]>;
  getUserTreatmentStages(userId: number): Promise<TreatmentStage[]>;
  createTreatmentStage(stage: InsertTreatmentStage): Promise<TreatmentStage>;
  updateTreatmentStage(id: number, updateData: Partial<TreatmentStage>): Promise<TreatmentStage | undefined>;
}

// In-memory storage implementation
export class MemStorage implements IStorage {
  private usersMap: Map<number, User>;
  private profilesMap: Map<number, Profile>;
  private appointmentsMap: Map<number, Appointment>;
  private treatmentStagesMap: Map<number, TreatmentStage>;
  private userIdCounter: number;
  private profileIdCounter: number;
  private appointmentIdCounter: number;
  private treatmentStageIdCounter: number;

  constructor() {
    this.usersMap = new Map();
    this.profilesMap = new Map();
    this.appointmentsMap = new Map();
    this.treatmentStagesMap = new Map();
    this.userIdCounter = 1;
    this.profileIdCounter = 1;
    this.appointmentIdCounter = 1;
    this.treatmentStageIdCounter = 1;
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.usersMap.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.usersMap.values()).find(
      (user) => user.username === username,
    );
  }

  async getAllUsers(): Promise<User[]> {
    return Array.from(this.usersMap.values());
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const now = new Date();
    const user: User = { 
      ...insertUser, 
      id, 
      isActive: true,
      createdAt: now,
      updatedAt: now,
    };
    this.usersMap.set(id, user);
    return user;
  }

  // Profile operations
  async getUserProfile(userId: number): Promise<Profile | undefined> {
    return Array.from(this.profilesMap.values()).find(
      (profile) => profile.userId === userId,
    );
  }

  async createOrUpdateProfile(insertProfile: InsertProfile): Promise<Profile> {
    // Check if profile exists
    const existingProfile = await this.getUserProfile(insertProfile.userId);
    
    if (existingProfile) {
      // Update existing profile
      const now = new Date();
      const updatedProfile: Profile = { 
        ...existingProfile, 
        ...insertProfile,
        updatedAt: now
      };
      this.profilesMap.set(existingProfile.id, updatedProfile);
      return updatedProfile;
    } else {
      // Create new profile
      const id = this.profileIdCounter++;
      const now = new Date();
      const profile: Profile = { 
        ...insertProfile, 
        id,
        createdAt: now,
        updatedAt: now
      };
      this.profilesMap.set(id, profile);
      return profile;
    }
  }

  // Appointment operations
  async getAppointment(id: number): Promise<Appointment | undefined> {
    return this.appointmentsMap.get(id);
  }

  async getAllAppointments(): Promise<Appointment[]> {
    return Array.from(this.appointmentsMap.values());
  }

  async getUserAppointments(userId: number): Promise<Appointment[]> {
    return Array.from(this.appointmentsMap.values()).filter(
      (appointment) => appointment.userId === userId,
    );
  }

  async createAppointment(insertAppointment: InsertAppointment): Promise<Appointment> {
    const id = this.appointmentIdCounter++;
    const now = new Date();
    const appointment: Appointment = { 
      ...insertAppointment, 
      id,
      createdAt: now,
      updatedAt: now
    };
    this.appointmentsMap.set(id, appointment);
    return appointment;
  }

  async updateAppointmentStatus(id: number, status: string): Promise<Appointment | undefined> {
    const appointment = this.appointmentsMap.get(id);
    
    if (!appointment) {
      return undefined;
    }
    
    const now = new Date();
    const updatedAppointment: Appointment = { 
      ...appointment, 
      status,
      updatedAt: now
    };
    this.appointmentsMap.set(id, updatedAppointment);
    return updatedAppointment;
  }

  // Treatment stage operations
  async getTreatmentStage(id: number): Promise<TreatmentStage | undefined> {
    return this.treatmentStagesMap.get(id);
  }

  async getAllTreatmentStages(): Promise<TreatmentStage[]> {
    return Array.from(this.treatmentStagesMap.values());
  }

  async getUserTreatmentStages(userId: number): Promise<TreatmentStage[]> {
    return Array.from(this.treatmentStagesMap.values()).filter(
      (stage) => stage.patientId === userId,
    );
  }

  async createTreatmentStage(insertStage: InsertTreatmentStage): Promise<TreatmentStage> {
    const id = this.treatmentStageIdCounter++;
    const now = new Date();
    const stage: TreatmentStage = { 
      ...insertStage, 
      id,
      createdAt: now,
      updatedAt: now
    };
    this.treatmentStagesMap.set(id, stage);
    return stage;
  }

  async updateTreatmentStage(id: number, updateData: Partial<TreatmentStage>): Promise<TreatmentStage | undefined> {
    const stage = this.treatmentStagesMap.get(id);
    
    if (!stage) {
      return undefined;
    }
    
    const now = new Date();
    const updatedStage: TreatmentStage = { 
      ...stage, 
      ...updateData,
      updatedAt: now
    };
    this.treatmentStagesMap.set(id, updatedStage);
    return updatedStage;
  }
}

export const storage = new MemStorage();
