import Avatar from "./Avatar";
import ReactTimeAgo from 'react-time-ago';

export default function Comment({ comment }) {
    return (
        <div className="flex mt-2 ml-4 px-2 gap-2 items-center">
            <Avatar />
            <div className="bg-gray-200 mt-1 py-1 px-4 rounded-3xl">
                <div>
                    <span className="hover:underline font-semibold mr-1">
                        {comment.username}
                    </span>
                    <span className="text-sm text-gray-400">
                        <ReactTimeAgo timeStyle={'twitter'} date={(new Date(comment.createdAt).getTime())} />
                    </span>
                </div>
                <p className="text-sm">
                    {comment.content}
                </p>
            </div>
        </div>
    );
}