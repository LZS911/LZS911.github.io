import { parseISO, format } from "date-fns";

type Props = {
  dateString: string;
};

const DateFormatter: React.FC<Props> = ({ dateString }) => {
  const date = parseISO(dateString);
  return (
    <time
      dateTime={dateString}
      className="text-center block my-4 text-sm opacity-60"
    >
      {format(date, "LLLL	d, yyyy")}
    </time>
  );
};

export default DateFormatter;
