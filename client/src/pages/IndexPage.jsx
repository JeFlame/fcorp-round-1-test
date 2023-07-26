import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const bookPhotos = [
    'https://images.unsplash.com/photo-1476275466078-4007374efbbe?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=829&q=80',
    'https://images.unsplash.com/photo-1573848855919-9abecc93e456?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80',
    'https://images.unsplash.com/photo-1593340010859-83edd3d6d13f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=876&q=80',
    'https://images.unsplash.com/photo-1591951425600-d09958978584?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80',
    'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80',
    'https://images.unsplash.com/photo-1602722053020-af31042989d5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80'
];

export default function LoginPage() {
    const [books, setBooks] = useState([]);

    useEffect(() => {
        axios.get('/books').then(response => {
            setBooks(response.data.items);
        });
    }, []);

    return (
        <>
            {books.length > 0 && (
                <div className="mt-8 grid gap-x-6 gap-y-8 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                    {books.map(book => (
                        <Link key={book.id} to={'/book/' + book.id}>
                            <div className="max-w-sm rounded overflow-hidden shadow-lg">
                                <img className="w-full" src={bookPhotos[Math.floor(Math.random() * bookPhotos.length)]} alt="Sunset in the mountains" />
                                <div className="px-6 py-4">
                                    <div className="font-bold text-xl mb-2">{book.title}</div>
                                    <p className="text-gray-700 text-base">{book.description}</p>
                                </div>
                                <div className="px-6 pb-2">
                                    <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">{book.author}</span>
                                    <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">{book.publishedDate}</span>
                                    <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">${book.price}</span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
            {books.length == 0 && (
                <div className="mt-8 text-center text-xl">
                    Look like there are no books available. Let&apos;s create some in DB first!
                </div>
            )}
        </>

    );
}