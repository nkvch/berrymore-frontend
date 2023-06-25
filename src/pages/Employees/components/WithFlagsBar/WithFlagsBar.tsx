import { FlagItem } from "../../../../api/queryFns/flags.query";
import { Flag, FlagsBar, RelativeDiv } from "./elements";

interface FlagsBarProps {
  flags: FlagItem[];
  hasShift: boolean;
  children: React.ReactNode;
}

function getReadableTextColor(backgroundColor: string): string {
  const [r, g, b] = backgroundColor.match(/\w\w/g)?.map(x => parseInt(x, 16)) ?? [0, 0, 0];
  const relativeLuminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  const blackContrastRatio = (relativeLuminance + 0.05) / 0.05;
  const whiteContrastRatio = 1.05 / (relativeLuminance + 0.05);
  return blackContrastRatio > whiteContrastRatio ? '#000000' : '#FFFFFF';
}

function WithFlagsBar(props: FlagsBarProps) {
  const { flags, hasShift } = props;

  return (
    <RelativeDiv>
      <FlagsBar>
        {hasShift && (
          <Flag sx={{
            backgroundColor: '#1aaf00',
            color: 'white'
          }} label="Смена" />
        )}
        {flags.map(flag => (
          <Flag key={flag.id} sx={{
            backgroundColor: flag.color,
            color: 'white'
          }} label={flag.name} />
        ))}
      </FlagsBar>
      {props.children}
    </RelativeDiv>
  )
}

export default WithFlagsBar;
