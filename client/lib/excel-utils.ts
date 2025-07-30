import * as XLSX from 'xlsx';
import { Branch } from '@shared/types';

export interface ExcelImportResult {
  success: boolean;
  data?: Omit<Branch, 'id' | 'createdAt' | 'updatedAt'>[];
  errors?: string[];
}

export function exportBranchesToExcel(branches: Branch[], filename: string = 'branches.xlsx') {
  const worksheet = XLSX.utils.json_to_sheet(
    branches.map(branch => ({
      'Branch ID': branch.id,
      'Branch Name': branch.branchName,
      'Location': branch.location,
      'Contact Person': branch.contactPerson,
      'Created At': new Date(branch.createdAt).toLocaleDateString(),
      'Updated At': new Date(branch.updatedAt).toLocaleDateString(),
    }))
  );

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Branches');
  
  // Set column widths
  const colWidths = [
    { wch: 12 }, // Branch ID
    { wch: 25 }, // Branch Name
    { wch: 30 }, // Location
    { wch: 25 }, // Contact Person
    { wch: 15 }, // Created At
    { wch: 15 }, // Updated At
  ];
  worksheet['!cols'] = colWidths;

  XLSX.writeFile(workbook, filename);
}

export function importBranchesFromExcel(file: File): Promise<ExcelImportResult> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        const errors: string[] = [];
        const validBranches: Omit<Branch, 'id' | 'createdAt' | 'updatedAt'>[] = [];

        jsonData.forEach((row: any, index: number) => {
          const rowNumber = index + 2; // Excel rows start at 1, header is row 1
          
          // Expected column names (flexible matching)
          const branchName = 
            row['Branch Name'] || 
            row['BranchName'] || 
            row['branch_name'] || 
            row['name'];
            
          const location = 
            row['Location'] || 
            row['location'] || 
            row['branch_location'];
            
          const contactPerson = 
            row['Contact Person'] || 
            row['ContactPerson'] || 
            row['contact_person'] || 
            row['contact'];

          // Validation
          if (!branchName || typeof branchName !== 'string' || branchName.trim() === '') {
            errors.push(`Row ${rowNumber}: Branch Name is required`);
          }
          
          if (!location || typeof location !== 'string' || location.trim() === '') {
            errors.push(`Row ${rowNumber}: Location is required`);
          }
          
          if (!contactPerson || typeof contactPerson !== 'string' || contactPerson.trim() === '') {
            errors.push(`Row ${rowNumber}: Contact Person is required`);
          }

          if (branchName && location && contactPerson) {
            validBranches.push({
              branchName: branchName.toString().trim(),
              location: location.toString().trim(),
              contactPerson: contactPerson.toString().trim(),
            });
          }
        });

        if (errors.length > 0) {
          resolve({
            success: false,
            errors
          });
        } else {
          resolve({
            success: true,
            data: validBranches
          });
        }
      } catch (error) {
        resolve({
          success: false,
          errors: ['Failed to parse Excel file. Please ensure it is a valid Excel file.']
        });
      }
    };

    reader.onerror = () => {
      resolve({
        success: false,
        errors: ['Failed to read file. Please try again.']
      });
    };

    reader.readAsBinaryString(file);
  });
}

export function downloadExcelTemplate() {
  const templateData = [
    {
      'Branch Name': 'Example Branch',
      'Location': 'Example City, State',
      'Contact Person': 'John Doe'
    }
  ];

  const worksheet = XLSX.utils.json_to_sheet(templateData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Branch Template');
  
  // Set column widths
  const colWidths = [
    { wch: 25 }, // Branch Name
    { wch: 30 }, // Location
    { wch: 25 }, // Contact Person
  ];
  worksheet['!cols'] = colWidths;

  XLSX.writeFile(workbook, 'branch_template.xlsx');
}
