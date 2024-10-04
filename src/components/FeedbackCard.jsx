import { Card, CardContent } from "./ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import PropTypes from "prop-types";

FeedbackCard.propTypes = {
  item: PropTypes.shape({
    userName: PropTypes.string,
    message: PropTypes.string,
    rating: PropTypes.number,
    date: PropTypes.string,
  }),
};

function FeedbackCard({ item }) {
  return (
    <Card className="max-w-full mb-4">
      <CardContent className="flex p-2">
        <div className="flex mt-1 ml-3">
          <Avatar className="rounded-sm w-16 h-16">
            <AvatarImage src="" />
            <AvatarFallback className="rounded-sm">
              {item?.userName?.charAt(0)?.toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </div>
        <div className="flex flex-col ml-4">
          <div>
            <p className="font-bold text-sm">{item?.userName}</p>
          </div>
          <div className="flex gap-0.5 my-2 flex-col">
            <div className="flex flex-row">
              {[...Array(5)].map((_, index) => (
                <StarIcon
                  key={index}
                  className={`h-5 w-5 cursor-pointer ${
                    item?.rating > index
                      ? "fill-yellow-400 stroke-none"
                      : "fill-muted stroke-muted"
                  } `}
                />
              ))}
            </div>
            <p className="text-sm">{item?.message}</p>
            <p className="text-justify">{item?.date}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default FeedbackCard;

function StarIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      //   className="lucide lucide-star"
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}
