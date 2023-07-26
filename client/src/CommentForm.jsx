import { useState } from "react";
import Avatar from "./Avatar";
import axios from "axios";

export default function CommentForm({ bookId }) {
    const [comment, setComment] = useState('');

    function postComment() {
        axios.post('/comments', { bookId, content: comment });
    }

    return (
        <div className="flex mt-3 px-2 gap-3 items-center">
            <div>
                <Avatar />
            </div>
            <div className="grow border rounded-full relative">
                <input
                    value={comment}
                    onChange={ev => setComment(ev.target.value)}
                    className="block w-full p-3 px-4 overflow-hidden h-12 rounded-full" placeholder="Leave a comment" />
                <button onClick={postComment} className="absolute top-3 right-3 bg-opacity-0">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                    </svg>
                </button>
            </div>
        </div>
    );
}