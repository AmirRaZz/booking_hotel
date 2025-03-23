declare module "react-date-range" {
  export interface Range {
    startDate: Date;
    endDate: Date;
    key: string;
  }

  export interface DateRangeProps {
    ranges: Range[];
    onChange: (item: { selection: Range }) => void;
    className?: string;
    minDate?: Date;
    moveRangeOnFirstSelection?: boolean;
  }

  export const DateRange: React.FC<DateRangeProps>;
}
