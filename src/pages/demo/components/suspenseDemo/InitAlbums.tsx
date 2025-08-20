import React, { use, useEffect, useState } from 'react';
import { getTaskList } from '../../../../service/api';

export default function Albums() {
    const [albums, setAlbums] = useState<{
        id: number;
        title: string;
        completed: boolean;
    }[] | []>([])
    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {
        const res = await getTaskList()
        setAlbums(res.data.data)
    }
    return (
        <div>
            <p>Albums:</p>

            {albums.length > 0
                ?
                <ul>
                    {
                        albums?.map(album => (
                            <li key={album.id}>
                                {album.title}
                            </li>
                        ))
                    }
                </ul>
                :
                <div>Loading...</div>
            }
        </div>

    );
}
