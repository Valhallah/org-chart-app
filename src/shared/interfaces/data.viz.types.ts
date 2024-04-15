export interface IPersonsProps {
    _id: string;
    name: {
      first: string;
      last: string;
    };
    createAt: string;
  }
  
  export interface IChangesProps {
    _id: string;
    jobId: string;
    type: string;
    date: string;
    status: string;
    data?: {
      title?: string;
      promotionType?: string;
      managerId?: string;
      personId?: string;
      comp?: {
        currency?: string;
        base?: number;
        grantShares?: number;
        grantType?: string;
      };
      departType?: string;
      fields?: {
        managerNotes?: string;
      };
    };
    createAt: string;
  }
  
  export interface IPosition {
    _id: string;
    jobId: string;
    title?: string;
    createAt: string;
    type?: string;
    status?: string;
    name?: {
      first: string;
      last: string;
    };
    comp?: {
      currency?: string;
      base?: number;
      grantShares?: number;
      grantType?: string;
    };
    promotionType?: string;
    personId?: string;
    managerId?: string;
  }