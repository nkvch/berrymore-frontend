import { FlagItem } from "../../../../api/queryFns/flags.query";
import { Flag, FlagsBar, RelativeDiv } from "./elements";

interface FlagsBarProps {
  flags: FlagItem[];
  hasShift: boolean;
  children: React.ReactNode;
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
