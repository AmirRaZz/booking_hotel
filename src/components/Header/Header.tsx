import { useRef, useState } from "react";
import { HiCalendar, HiMinus, HiPlus, HiSearch } from "react-icons/hi";
import { MdLocationOn } from "react-icons/md";
import useOutSideClick from "../../hooks/useOutSideClick";
import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css"; // theme css file
import { DateRange } from "react-date-range";
import { format } from "date-fns";

const optionsType = [
  {
    id: 1,
    type: "Adult",
    count: 1,
    minLimit: 1,
    maxLimit: 10,
  },
  {
    id: 2,
    type: "Children",
    count: 0,
    minLimit: 0,
    maxLimit: 10,
  },
  {
    id: 3,
    type: "Room",
    count: 1,
    minLimit: 1,
    maxLimit: 10,
  },
];

function Header() {
  const [destination, setDestination] = useState("");
  const [openOptions, setOpenOptions] = useState(false);
  const [options, setOptions] = useState(optionsType);
  const [date, setDate] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ]);
  const [openDate, setOpenDate] = useState(false);

  const handleOptions = (name: string, operation: string) => {
    setOptions((prev) => {
      return prev.map((option) =>
        option.type === name
          ? {
              ...option,
              count: operation === "inc" ? option.count + 1 : option.count - 1,
            }
          : option
      );
    });
  };

  return (
    <div className="header">
      <div className="headerSearch">
        <div className="headerSearchItem">
          <MdLocationOn className="headerIcon locationIcon" />
          <input
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            type="text"
            placeholder="Where are you going?"
            className="headerSearchInput"
            name="destination"
            id="destination"
          />
          <span className="separator"></span>
        </div>
        <div className="headerSearchItem">
          <HiCalendar className="headerIcon dateIcon" />
          <div onClick={() => setOpenDate(!openDate)} className="dateDropDown">
            {`${format(date[0].startDate, "MM/dd/yyyy")} to ${format(
              date[0].startDate,
              "MM/dd/yyyy"
            )}`}
          </div>
          {openDate && (
            <DateRange
              ranges={date}
              onChange={(item) => setDate([item.selection])}
              className="date"
              minDate={new Date()}
              moveRangeOnFirstSelection={true}
            />
          )}
          <span className="separator"></span>
        </div>
        <div className="headerSearchItem">
          <div id="optionDropDown" onClick={() => setOpenOptions(!openOptions)}>
            {options.map((option, index) => {
              return (
                <span key={option.id}>
                  {option.count} {option.type}
                  {index < options.length - 1 && " • "}
                  {/* {index < options.length - 1 && (
                    <span
                      dangerouslySetInnerHTML={{ __html: "&nbsp;&bull;&nbsp;" }}
                    />
                  )} */}
                </span>
              );
            })}
          </div>
          {openOptions && (
            <GuestOptionList
              options={options}
              setOpenOptions={setOpenOptions}
              handleOptions={handleOptions}
            />
          )}
          <span className="separator"></span>
        </div>
        <div className="headerSearchItem">
          <button className="headerSearchBtn">
            <HiSearch className="headerIcon" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default Header;

const GuestOptionList = ({
  options,
  handleOptions,
  setOpenOptions,
}: {
  options: {
    id: number;
    type: string;
    count: number;
    minLimit: number;
    maxLimit: number;
  }[];
  handleOptions: (name: string, operation: string) => void;
  setOpenOptions: (openOptions: boolean) => void;
}) => {
  const optionRef = useRef<HTMLDivElement>(
    null
  ) as React.RefObject<HTMLDivElement>;
  useOutSideClick(optionRef, "optionDropDown", () => setOpenOptions(false));
  return (
    <div className="guestOptions" ref={optionRef}>
      {options.map((option) => {
        return (
          <div key={option.id} className="guestOptionItem">
            <span className="optionText">{option.type}</span>
            <div className="optionCounter">
              <button
                className="optionCounterBtn"
                onClick={() => handleOptions(option.type, "dec")}
                disabled={option.count <= option.minLimit}
              >
                <HiMinus className="icon" />
              </button>
              <span className="optionCounterNumber">{option.count}</span>
              <button
                className="optionCounterBtn"
                onClick={() => handleOptions(option.type, "inc")}
                disabled={option.count >= option.maxLimit}
              >
                <HiPlus className="icon" />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};
