import { QRCodeCanvas } from "qrcode.react";

interface InvisibleQRCodesProps {
  data: {
    berryId: string;
    QRCodeHtmlID: string;
  }[];
}

const InvisibleQRCodes = ({ data }: InvisibleQRCodesProps) => {
  console.log(data);
  return (
    <>
      {
        data.map(({ berryId, QRCodeHtmlID }) => (
          <QRCodeCanvas
            id={QRCodeHtmlID}
            value={berryId}
            key={`${berryId}qrcanvaskey`}
            style={{ display: 'none' }}
          />
        ))
      }
    </>
  );
};

export default InvisibleQRCodes;
