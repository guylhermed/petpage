import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { doc, getDoc } from "firebase/firestore";
import { firebaseConfigSelector } from "@/app/config/firebaseConfigSelector";
import { FaImage } from "react-icons/fa";

export default function PetPage() {
    const router = useRouter();
    const { uniqueSlug } = router.query;
    const [petData, setPetData] = useState(null);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const { db } = firebaseConfigSelector();

    useEffect(() => {
        const fetchPetData = async () => {
            if (uniqueSlug) {
                const petDocRef = doc(db, "pets", uniqueSlug);
                const petDoc = await getDoc(petDocRef);

                if (petDoc.exists()) {
                    setPetData(petDoc.data());
                    console.log("Dados do pet encontrados:", petDoc.data());
                } else {
                    console.log("Pet não encontrado!");
                }
            }
        };

        fetchPetData();
    }, [uniqueSlug]);

    // Alterna as imagens automaticamente
    useEffect(() => {
        if (petData?.images?.length > 1) {
            const interval = setInterval(() => {
                setCurrentImageIndex((prevIndex) =>
                    (prevIndex + 1) % petData.images.length
                );
            }, 3000);

            return () => clearInterval(interval); // Limpa o intervalo ao desmontar
        }
    }, [petData]);

    if (!petData) {
        return <div>Carregando...</div>;
    }

    return (
        <div className="flex justify-center items-center h-screen bg-black">
            <div className="rounded-lg shadow-lg overflow-hidden w-80 md:w-96 bg-gray-900">
                {/* Simulação de Navegador */}
                <div className="bg-gray-800 text-white p-2 text-sm">
                    <p>{`petpage.com/${uniqueSlug}`}</p>
                </div>
                {/* Retângulo representando a tela do celular */}
                <div className="h-160 flex flex-col p-4 overflow-y-auto">
                    {/* Área para a imagem do pet */}
                    <div className="relative w-full h-100 bg-gray-200 border-4 border-green-500 mb-2 flex items-center justify-center rounded-lg">
                        {petData.images && petData.images.length > 0 ? (
                            <img
                                src={petData.images[currentImageIndex]}
                                alt={petData.name}
                                className="w-full h-full object-cover rounded-lg"
                            />
                        ) : (
                            <FaImage className="text-green-500 w-16 h-16" />
                        )}
                    </div>
                    {/* Informações do Pet */}
                    <div className="text-center text-white">
                        <h2 className="text-xl font-bold mb-2">{petData.name}</h2>
                        {petData.nicknames?.length > 0 && (
                            <p className="text-md mb-2">
                                Também me chamam de: {petData.nicknames.join(", ")}
                            </p>
                        )}
                        {petData.timeInFamily && (
                            <p className="text-md mb-2">
                                Estou na família há {petData.timeInFamily}
                            </p>
                        )}
                        {petData.message && (
                            <p className="text-md mb-2">{petData.message}</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
