'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import Footer from '@/componentes/Footer/Footer';

interface FichaDetalhes {
  id: string;
  nome: string;
  sistema: string;
  nivel?: number;
  classe?: string;
  raca?: string;
  sanidade?: number;
  cla?: string;
  atributos?: {
    [key: string]: number;
  };
  habilidades?: string[];
}

export default function FichaPage() {
  const [ficha, setFicha] = useState<FichaDetalhes | null>(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const router = useRouter();
  const params = useParams();
  const fichaId = params.id as string;

  useEffect(() => {
    // Verifica se o usuário está logado
    const token = localStorage.getItem('token');
    
    if (!token) {
      alert('Você precisa estar logado para acessar esta página.');
      router.push('/login');
      return;
    }

    const fetchData = async () => {
      if (fichaId === 'nova') {
        // Modo de criação de nova ficha
        setFicha({
          id: 'nova',
          nome: '',
          sistema: 'dnd',
          nivel: 1,
          classe: '',
          raca: '',
          atributos: {
            forca: 10,
            destreza: 10,
            constituicao: 10,
            inteligencia: 10,
            sabedoria: 10,
            carisma: 10
          },
          habilidades: []
        });
        setEditMode(true);
        setLoading(false);
      } else {
        await fetchFichaData(fichaId);
      }
    };

    fetchData();
  }, [fichaId, router]);

  const fetchFichaData = async (id: string) => {
    try {
      // Dados mockados - substitua pela API real
      const fichasMock: { [key: string]: FichaDetalhes } = {
        '1': {
          id: '1',
          nome: 'D&D - Teste',
          sistema: 'dnd',
          nivel: 5,
          classe: 'Maga',
          raca: 'Elfa',
          atributos: {
            forca: 8,
            destreza: 14,
            constituicao: 12,
            inteligencia: 16,
            sabedoria: 13,
            carisma: 11
          },
          habilidades: ['Bola de Fogo', 'Mísseis Mágicos', 'Escudo']
        },
        '2': {
          id: '2',
          nome: 'Cyberpunk - Teste',
          sistema: 'cyberpunk',
          classe: 'Netrunner',
          atributos: {
            tech: 8,
            reflexos: 6,
            legal: 4,
            corpo: 5,
            inteligencia: 9,
            presenca: 6
          },
          habilidades: ['Hacking', 'Programação', 'Eletrônica']
        }
      };

      const fichaData = fichasMock[id];
      if (fichaData) {
        setFicha(fichaData);
      } else {
        alert('Ficha não encontrada.');
        router.push('/hub');
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Erro ao buscar ficha:', error);
      alert('Erro ao carregar ficha.');
      router.push('/hub');
    }
  };

  const handleSave = async () => {
    if (!ficha) return;

    try {
      // TODO: Implementar salvamento real
      console.log('Salvando ficha:', ficha);
      
      if (fichaId === 'nova') {
        alert('Nova ficha criada com sucesso!');
        router.push('/hub');
      } else {
        alert('Ficha salva com sucesso!');
        setEditMode(false);
      }

      /* 
      // Implementação real da API:
      const response = await fetch(`/api/fichas/${fichaId === 'nova' ? '' : fichaId}`, {
        method: fichaId === 'nova' ? 'POST' : 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(ficha)
      });

      if (!response.ok) {
        throw new Error('Erro ao salvar ficha.');
      }

      const data = await response.json();
      setFicha(data);
      setEditMode(false);
      */
    } catch (error) {
      console.error('Erro ao salvar ficha:', error);
      alert('Erro ao salvar ficha.');
    }
  };

  const handleDelete = async () => {
    if (!ficha || fichaId === 'nova') return;

    if (confirm('Tem certeza que deseja excluir esta ficha?')) {
      try {
        // TODO: Implementar exclusão real
        alert('Ficha excluída com sucesso!');
        router.push('/hub');

        /* 
        // Implementação real da API:
        const response = await fetch(`/api/fichas/${fichaId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        if (!response.ok) {
          throw new Error('Erro ao excluir ficha.');
        }

        router.push('/hub');
        */
      } catch (error) {
        console.error('Erro ao excluir ficha:', error);
        alert('Erro ao excluir ficha.');
      }
    }
  };

  const updateFicha = (campo: string, valor: string | number) => {
    if (!ficha) return;
    setFicha({
      ...ficha,
      [campo]: valor
    });
  };

  const updateAtributo = (atributo: string, valor: number) => {
    if (!ficha) return;
    setFicha({
      ...ficha,
      atributos: {
        ...ficha.atributos,
        [atributo]: valor
      }
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-white text-xl">Carregando ficha...</div>
      </div>
    );
  }

  if (!ficha) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-white text-xl">Ficha não encontrada.</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4 flex flex-col">
      <div className="max-w-4xl mx-auto flex-grow">
        {/* Header */}
        <div className="flex justify-between items-center mb-8 pt-8">
          <div className="flex items-center space-x-4">
            <Link 
              href="/hub"
              className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              ← Voltar
            </Link>
            <h1 className="text-3xl font-bold text-white">
              {editMode ? 
                <input
                  type="text"
                  value={ficha.nome}
                  onChange={(e) => updateFicha('nome', e.target.value)}
                  className="bg-white/10 text-white px-3 py-1 rounded border-none outline-none"
                  placeholder="Nome da ficha"
                />
                : ficha.nome
              }
            </h1>
          </div>
          
          <div className="space-x-2">
            {editMode ? (
              <>
                <button 
                  onClick={handleSave}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Salvar
                </button>
                <button 
                  onClick={() => setEditMode(false)}
                  className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Cancelar
                </button>
              </>
            ) : (
              <>
                <button 
                  onClick={() => setEditMode(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Editar
                </button>
                {fichaId !== 'nova' && (
                  <button 
                    onClick={handleDelete}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    Excluir
                  </button>
                )}
              </>
            )}
          </div>
        </div>

        {/* Conteúdo da Ficha */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Informações Básicas */}
          <div className="bg-white/10 backdrop-blur-md rounded-lg p-6">
            <h2 className="text-xl font-bold text-white mb-4">Informações Básicas</h2>
            <div className="space-y-3">
              <div>
                <label className="block text-gray-300 mb-1">Sistema:</label>
                {editMode ? (
                  <select
                    value={ficha.sistema}
                    onChange={(e) => updateFicha('sistema', e.target.value)}
                    className="w-full bg-white/10 text-white px-3 py-2 rounded border border-gray-600 outline-none"
                  >
                    <option value="dnd">D&D 5e</option>
                    <option value="cyberpunk">Cyberpunk 2020</option>
                    <option value="cthulhu">Call of Cthulhu</option>
                    <option value="vampiro">Vampiro: A Máscara</option>
                  </select>
                ) : (
                  <p className="text-white">{ficha.sistema}</p>
                )}
              </div>
              
              {ficha.sistema === 'dnd' && (
                <>
                  <div>
                    <label className="block text-gray-300 mb-1">Nível:</label>
                    {editMode ? (
                      <input
                        type="number"
                        value={ficha.nivel || 1}
                        onChange={(e) => updateFicha('nivel', parseInt(e.target.value))}
                        className="w-full bg-white/10 text-white px-3 py-2 rounded border border-gray-600 outline-none"
                      />
                    ) : (
                      <p className="text-white">{ficha.nivel}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-gray-300 mb-1">Classe:</label>
                    {editMode ? (
                      <input
                        type="text"
                        value={ficha.classe || ''}
                        onChange={(e) => updateFicha('classe', e.target.value)}
                        className="w-full bg-white/10 text-white px-3 py-2 rounded border border-gray-600 outline-none"
                      />
                    ) : (
                      <p className="text-white">{ficha.classe}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-gray-300 mb-1">Raça:</label>
                    {editMode ? (
                      <input
                        type="text"
                        value={ficha.raca || ''}
                        onChange={(e) => updateFicha('raca', e.target.value)}
                        className="w-full bg-white/10 text-white px-3 py-2 rounded border border-gray-600 outline-none"
                      />
                    ) : (
                      <p className="text-white">{ficha.raca}</p>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Atributos */}
          <div className="bg-white/10 backdrop-blur-md rounded-lg p-6">
            <h2 className="text-xl font-bold text-white mb-4">Atributos</h2>
            <div className="grid grid-cols-2 gap-3">
              {ficha.atributos && Object.entries(ficha.atributos).map(([atributo, valor]) => (
                <div key={atributo}>
                  <label className="block text-gray-300 mb-1 capitalize">{atributo}:</label>
                  {editMode ? (
                    <input
                      type="number"
                      value={valor}
                      onChange={(e) => updateAtributo(atributo, parseInt(e.target.value))}
                      className="w-full bg-white/10 text-white px-3 py-2 rounded border border-gray-600 outline-none"
                    />
                  ) : (
                    <p className="text-white text-lg font-bold">{valor}</p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Habilidades */}
          <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 lg:col-span-2">
            <h2 className="text-xl font-bold text-white mb-4">Habilidades</h2>
            <div className="flex flex-wrap gap-2">
              {ficha.habilidades?.map((habilidade, index) => (
                <span
                  key={index}
                  className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm"
                >
                  {habilidade}
                </span>
              ))}
              {(!ficha.habilidades || ficha.habilidades.length === 0) && (
                <p className="text-gray-400">Nenhuma habilidade cadastrada</p>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
