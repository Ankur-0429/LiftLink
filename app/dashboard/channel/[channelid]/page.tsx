import MessageChannel from "./MessageChannel";

const ChannelPage = ({ params }: {params: {channelid: string}}) => {
  return <MessageChannel channelid={params.channelid} />;
};

export default ChannelPage;
