export interface Profile {
  Name: string;
  DOB: string;
  Email: string;
  Phone: string;
  Education: {
    degree: string;
    institution: string;
    startYear: string;
    endYear: string;
    grade: string;
  }[];
  Resume: Buffer;
}
