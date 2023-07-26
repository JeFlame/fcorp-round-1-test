export default function Book({ book }) {
    return (
        <>
            <div className="px-6 pt-4">
                <div className="font-bold text-3xl mb-1">
                    <div>{book.title}</div>
                    <div className="flex items-center gap-3 mt-3">
                        <div className="bg-gray-200 rounded-full px-2 py-1 text-sm font-semibold text-gray-700">{book.author}</div>
                        <div className="bg-gray-200 rounded-full px-2 py-1 text-sm font-semibold text-gray-700">{book.publishedDate}</div>
                    </div>
                </div>
            </div>
            <div className="px-6 py-2">
                <p className="text-gray-700 text-base">{book.description}</p>
                <div className="text-center bg-gray-200 rounded-full mt-4 p-2 text-xl font-semibold text-gray-700">Price: ${book.price}</div>
            </div>

        </>
    );
}