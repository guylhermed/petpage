import { useEffect, useState } from 'react';
import { useRouter } from 'next/router'; // IMPORTANDO O useRouter
import { doc, getDoc } from 'firebase/firestore';
import { firebaseConfigSelector } from '@/app/config/firebaseConfigSelector';

export default function PetPage() {
    const router = useRouter();  // Agora você pode acessar o router aqui
    const { uniqueSlug } = router.query;  // Pegando o uniqueSlug da URL
    const [petData, setPetData] = useState(null);
    const { db } = firebaseConfigSelector();

    useEffect(() => {
        const fetchPetData = async () => {
            if (uniqueSlug) {
                const petDocRef = doc(db, 'pets', uniqueSlug);  // Referência para o documento do pet
                const petDoc = await getDoc(petDocRef);

                // Printando as informações do documento para debug
                console.log('Document fetched:', petDoc);

                if (petDoc.exists()) {
                    const petInfo = petDoc.data();
                    console.log('Pet Data:', petInfo);  // Mostrando os dados do pet no console
                    setPetData(petInfo);
                } else {
                    console.log("Pet não encontrado!");
                }
            }
        };

        fetchPetData();
    }, [uniqueSlug]);

    if (!petData) {
        return <div>Carregando...</div>;
    }

    return (
        <div className="min-h-screen flex flex-col justify-center items-center bg-black text-white">
            <div className="text-center max-w-lg">
                <h1 className="text-3xl font-bold mb-4">{petData.name}</h1>
                <p className="text-lg mb-6">Informações do pet: {petData.name}</p>

                {/* Exemplo de exibição de outros dados do pet */}
                <p>{petData.message}</p>

                {/* Outras informações podem ser exibidas aqui conforme os dados disponíveis */}
            </div>
        </div>
    );
}
