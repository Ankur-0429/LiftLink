import Channel from "@/components/channel";
import CreatePost from "./createPost";
import Filters from "./filters";

const memberData = () => {
  const data = [];
  for (let i = 0; i < 4; i++) {
    data.push({ name: "Charles", image: `https://i.pravatar.cc/${i + 70}` });
  }
  return data;
};

const Dashboard = () => {
  return (
    <div className="max-w-screen-lg mx-auto">
      <div className="bg-muted p-5 w-full gap-y-3 flex flex-col">
        <CreatePost />
        <Filters />
      </div>
      <Channel
        owner={{ name: "Ankur Ahir", image: "false" }}
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
