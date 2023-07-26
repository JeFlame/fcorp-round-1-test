import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Book from "../Book";
import { UserContext } from "../UserContext";
import CommentForm from "../CommentForm";
import Comment from "../Comment";

const bookPhotos = [
    'https://images.unsplash.com/photo-1476275466078-4007374efbbe?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=829&q=80',
    'https://images.unsplash.com/photo-1573848855919-9abecc93e456?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80',
    'https://images.unsplash.com/photo-1593340010859-83edd3d6d13f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=876&q=80',
    'https://images.unsplash.com/photo-1591951425600-d09958978584?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80',
    'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80',
    'https://images.unsplash.com/photo-1602722053020-af31042989d5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80'
];

export default function BookPage() {
    const { user } = useContext(UserContext)
    const { id } = useParams();
    const [book, setBook] = useState({});
    const [comments, setComments] = useState([]);

    useEffect(() => {
        axios.get(`/books/${id}`).then(response => {
            setBook(response.data.item);
        });
    }, [id]);

    useEffect(() => {
        axios.get(`/comments?bookId=${id}`).then(response => {
            setComments(response.data.items);
        });
    }, []);

    return (
        <div className="mx-auto mt-10">
            <div className="flex">
                <div>
                    <img className="w-full" src={bookPhotos[Math.floor(Math.random() * bookPhotos.length)]} alt="Sunset in the mountains" />
                </div>
                <div className="max-w-sm rounded overflow-hidden border border-1 shadow-lg">
                    <Book book={book} />
                    {!user && (
                        <div className="flex gap-2 items-center ml-20 mt-10">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
                            </svg>
                            <div>
                                Login first to see comments!
                            </div>
                        </div>
                    )}
                    {!!user && (
                        <>
                            <CommentForm bookId={id} />
                            {comments.length > 0 && comments.map((comment, index) => (
                                <Comment key={index} comment={comment} />
                            ))}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}