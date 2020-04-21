import React, { useState, useCallback, useEffect } from 'react';
import api from '../../Services/api';
import { Link } from 'react-router-dom';
import { FaGithub, FaPlus, FaSpinner, FaBars, FaTrash } from 'react-icons/fa';
import { Container, Form, SubmitButton, List, DeleteButton } from './styles';


export default function Main(){

    const [newRepo, setnewRepo] = useState('');
    const [Repositorios, setRepositorios] = useState([]);
    const [loading, setLoading] = useState(false);
    const [alert, setAlert] = useState(null);

    //didMount/ Buscar
    useEffect(() => {
        const repoStorage = localStorage.getItem('repos');

        if(repoStorage){
            setRepositorios(JSON.parse(repoStorage));
        }
    }, []);

    //DidUpdate/ Salvar alterações
    useEffect(() => {
        localStorage.setItem('repos', JSON.stringify(Repositorios));
    }, [Repositorios]);

    const handleSubmit =useCallback( (e)=>{
        e.preventDefault();

        async function submit(){
            setLoading(true);
            setAlert(null);
            try {

                if(newRepo === ''){
                    throw new Error('Você precisa inicar um repositório!')
                }

                const response = await api.get(`repos/${newRepo}`);

                const hasRepo = Repositorios.find(repo => repo.name === newRepo);

                if(hasRepo){
                    throw new Error('Repositório duplicado!');
                }

                const data = {
                    name: response.data.full_name,
                }
    
                setRepositorios([...Repositorios, data]);
                setnewRepo('');
            } catch (error) {
                setAlert(true);
                console.log(error);
            } finally{
                setLoading(false);
            }
        }

        submit();

    }, [newRepo, Repositorios]);

    function handleinputChange(e){
        setnewRepo(e.target.value);
        setAlert(null);
    }

    const handleDelete = useCallback( (repo) => {
        const find = Repositorios.filter(r => r.name !== repo);
        setRepositorios(find);
    }, [Repositorios]);

    return(
        <Container>
            <h1><FaGithub size={25} /> Meus Repositórios</h1>

            <Form onSubmit={handleSubmit} error={alert} > 
                <input 
                    type="text" 
                    placeholder="Adicionar repositórios" 
                    value={newRepo}
                    onChange={handleinputChange}
                />

                <SubmitButton loading={loading ? 1 : 0} >
                    { loading ? (
                        <FaSpinner color="#FFF" size={14} />
                    ) : (
                        <FaPlus color="#FFF" size={14} />
                    )}
                </SubmitButton>
            </Form>

            <List>
                {Repositorios.map(repo => (
                    <li key={repo.name}>
                        <DeleteButton onClick={()=> handleDelete(repo.name)} >
                            <FaTrash size={14} />
                        </DeleteButton>

                        <span>{repo.name}</span>
                        <Link to={`/repositorio/${encodeURIComponent(repo.name)}`}>
                            <FaBars size={20} />
                        </Link>
                    </li>
                ))}
            </List>

        </Container>
    );
}