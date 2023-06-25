import { PDFDownloadLink } from "@react-pdf/renderer";
import { EmployeeTableItem } from "../../../../api/queryFns/employees.query";
import Modal from "../../../../components/common/Modal/Modal";
import InvisibleQRCodes from "../InvisibleQRCodes/InvisibleQRCodes";
import { ModalContent, ModalTitle, PrintAllButton, PrintSelectedButton } from "./elements";
import MultipleQRCodes from "../MultipleQRCodes/MultipleQRCodes";
import { GridRowId } from "@mui/x-data-grid";
import { useMemo, useState } from "react";
import { Button } from "@mui/material";
import { Download } from "@mui/icons-material";

interface PrintModalProps {
  selected: GridRowId[];
  allData: EmployeeTableItem[];
  onClose: () => void;
}

const getQRCodeHtmlID = (berryId: string) => `${berryId}qrcode`;

function PrintModal(props: PrintModalProps) {
  const {
    selected,
    allData,
    onClose,
  } = props;

  const [printOption, setPrintOption] = useState<'selected' | 'all' | null>(null);

  const selectedData = useMemo(() => {
    return allData.filter((employee) => selected.includes(employee.id));
  }, [selected, allData]);

  const invisibleQRcodesData = useMemo(() => {
    if (!printOption) return [];

    const dataToUse = printOption === 'selected' ? selectedData : allData;

    return dataToUse.map((employee) => {
      return {
        berryId: employee.berryId,
        QRCodeHtmlID: getQRCodeHtmlID(employee.berryId),
      }
    })
  }, [selectedData, allData, printOption]);

  const multipleQRcodesData = useMemo(() => {
    if (!printOption) return [];

    const dataToUse = printOption === 'selected' ? selectedData : allData;

    return dataToUse.map((employee) => {
      return {
        firstName: employee.firstName,
        lastName: employee.lastName,
        QRCodeHtmlID: getQRCodeHtmlID(employee.berryId),
      }
    })
  }, [allData, selectedData, printOption]);

  return (
    <Modal
      open
      onClose={onClose}
    >
      <ModalTitle>Печать QR-кодов</ModalTitle>
      <ModalContent>
        {
          printOption === null ? (
            <>
              <PrintSelectedButton
                onClick={() => setPrintOption('selected')}
              >
                Все выбранные ({selected.length})
              </PrintSelectedButton>
              <PrintAllButton
                onClick={() => setPrintOption('all')}
              >
                Всю страницу
              </PrintAllButton>
            </>
          ) : (
            <Button
              variant="outlined"
              endIcon={<Download />}
              sx={{ width: '100%' }}
            >
              <InvisibleQRCodes data={invisibleQRcodesData} />
              <PDFDownloadLink
                document={<MultipleQRCodes data={multipleQRcodesData} />}
                fileName={`QRs.pdf`}
              >
                Загрузить PDF
              </PDFDownloadLink>
            </Button>
          )
        }
      </ModalContent>
    </Modal>
  )
}

export default PrintModal;
