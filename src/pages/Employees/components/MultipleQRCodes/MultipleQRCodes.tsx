import { Document, Page, Text, Image, View, Font, StyleSheet } from '@react-pdf/renderer';

Font.register({
  family: 'Roboto',
  src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-medium-webfont.ttf',
});

const orientation = 'landscape';
const inRow = 5;
const inColumn = 5;
const borderStyle = '1px dashed black';

const hasBottomBorder = (idx: number, num: number, numRows: number) => {
  const isInRow = Math.ceil((idx + 1) / inRow);
  const thisRowIsLast = isInRow === numRows;
  const nextRowIsLast = isInRow === numRows - 1;
  const nextRowHas = nextRowIsLast ? num - (isInRow * inRow) : inRow;
  const myNumInRow = isInRow === 1 ? idx : idx % (inRow * (isInRow - 1));
  const isNotCoveredWithNextRow = nextRowIsLast && (myNumInRow >= nextRowHas);

  const isOnBottmEdge = isInRow === inColumn;

  return !isOnBottmEdge && (isNotCoveredWithNextRow || thisRowIsLast);
};

const hasRightBorder = (idx: number, num: number) => {
  const isLast = idx === num - 1;
  const isOnRightEdge = !((idx + 1) % inRow);

  return isLast && !isOnRightEdge;
};

const styles = StyleSheet.create({
  page: {
    display: 'flex',
    overflow: 'hidden',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  card: ((idx: number, num: number, numRows: number) => ({
    height: `${210 / inColumn}mm`,
    width: `${297 / inRow}mm`,
    borderLeft: idx % inRow ? borderStyle : 0,
    borderTop: idx >= inRow ? borderStyle : 0,
    borderBottom: hasBottomBorder(idx, num, numRows) ? borderStyle : 0,
    borderRight: hasRightBorder(idx, num) ? borderStyle : 0,
    display: 'flex',
    flexFlow: 'column',
    justifyContent: 'space-around',
    alignItems: 'center',
  })) as any,
  names: {
    fontFamily: 'Roboto',
    fontSize: '14px',
  },
  qrcode: {
    height: '30mm',
    width: '30mm',
  },
});

const createCardStyles = (idx: number, num: number, numRows: number) => {
  return StyleSheet.create({
    card: {
      height: `${210 / inColumn}mm`,
      width: `${297 / inRow}mm`,
      borderLeft: idx % inRow ? borderStyle : 0,
      borderTop: idx >= inRow ? borderStyle : 0,
      borderBottom: hasBottomBorder(idx, num, numRows) ? borderStyle : 0,
      borderRight: hasRightBorder(idx, num) ? borderStyle : 0,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-around',
      alignItems: 'center',
    }
  })
};



interface MultipleQRCodesProps {
  data: {
    QRCodeHtmlID: string;
    firstName: string;
    lastName: string;
  }[];
}

const MultipleQRCodes = ({ data }: MultipleQRCodesProps) => {

  const numRows = Math.ceil(data.length / inRow);

  return (
    <Document>
      <Page orientation={orientation} size="A4" style={styles.page}>
        {
          data.map(({ QRCodeHtmlID, firstName, lastName }, idx) => {
            const cardStyles = createCardStyles(idx, data.length, numRows);
            const qrCodeImage = (document.getElementById(QRCodeHtmlID) as HTMLCanvasElement).toDataURL();

            return (
              <View style={cardStyles.card} key={`pdfcardview${idx}`}>
                <View style={styles.names}>
                  <Text>{`${lastName} ${firstName}`}</Text>
                </View>
                <Image
                  src={qrCodeImage}
                  style={styles.qrcode}
                />
              </View>
            )
          })
        }
      </Page>
    </Document>
  );
}

export default MultipleQRCodes;
