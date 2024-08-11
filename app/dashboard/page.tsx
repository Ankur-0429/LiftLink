import Channel from "@/components/channel";
import CreatePost from "./createPost";
import Filters from "./filters";
import { Separator } from "@/components/ui/separator";

const memberData = () => {
  const data = [];
  for (let i = 0; i < 4; i++) {
    data.push({ name: "Charles", image: `https://i.pravatar.cc/${i + 70}`, id: `${i}` });
  }
  return data;
};

const Dashboard = () => {
  return (
    <div className="max-w-screen-lg mx-auto border-l-[1px] border-r-[1px]">
      <div className="w-full gap-y-3 flex flex-col mt-3 px-5">
        <CreatePost />
        <Filters />
      </div>
      <Separator className="mt-5" />
      <Channel
        owner={{ name: "Ankur Ahir", image: "false", id: "5" }}
        limit={5}
        members={memberData()}
        createdAt={new Date("2024-08-08T07:25:32.653Z")}
        description="Looking for people to move to slugWatch 2022. If anyone wants to carpool with me at cameron way, feel free to message me. Looking for anyone interested."
        ifRequestedAlready={false}
      />
    </div>
  );
};

export default Dashboard;
