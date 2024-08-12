import CreatePost from "./createPost";
import Filters from "./filters";
import { Separator } from "@/components/ui/separator";
import DashboardChannelsList from "./channelList";

const Dashboard = () => {

  return (
    <div className="max-w-screen-lg mx-auto border-l-[1px] border-r-[1px]">
      <div className="w-full gap-y-3 flex flex-col mt-3 px-5">
        <CreatePost />
        <Filters />
      </div>
      <Separator className="mt-5" />
      <DashboardChannelsList />
    </div>
  );
};

// http://localhost:3000/dashboard/profile/clzous37j0003yfw3cuil8rk2

export default Dashboard;
