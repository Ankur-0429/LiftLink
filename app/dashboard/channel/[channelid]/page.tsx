import MessageChannel from "./MessageChannel";

type Props = {
  params: { channelid: string };
};

const ChannelPage = ({ params }: Props) => {
  return <MessageChannel channelid={params.channelid} />;
};

export default ChannelPage;
