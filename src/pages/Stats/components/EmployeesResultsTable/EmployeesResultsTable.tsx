import { Accordion, AccordionDetails, AccordionSummary, Table } from "@mui/material";
import { StatsResponse } from "../../../../api/queryFns/stats.query";
import { ArrowDropDown, Expand } from "@mui/icons-material";

interface EmployeesResultsTableProps {
  employees: StatsResponse['topEmployees']
}

const EmployeesResultsTable = ({ employees }: EmployeesResultsTableProps) => {
  return (
    <Accordion>
      <AccordionSummary
        expandIcon={<ArrowDropDown />}
      >
        Результаты сборщиков за период
      </AccordionSummary>
      <AccordionDetails>
        <Table>
          <thead>
            <tr>
              <th>Сборщик</th>
              <th>Кол-во</th>
            </tr>
          </thead>
          <tbody>
            {
              employees.map((employee) => (
                <tr key={employee.id}>
                  <td>{`${employee.lastName} ${employee.firstName}`}</td>
                  <td>{employee.amount} кг</td>
                </tr>
              ))
            }
          </tbody>
        </Table>
      </AccordionDetails>
    </Accordion>
  )
}

export default EmployeesResultsTable;
