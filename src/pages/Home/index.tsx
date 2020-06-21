import React, { useState, useEffect, FormEvent } from 'react';
import { TextField, Button } from '@material-ui/core';
import api from '../../services/api';

import './styles.css';

interface GroupModel {
    _id: string;
    label: string;
}

interface WordsResponse {
    _id: string;
    label: string;
    wordGroup: {
        _id: string;
        label: string;
    }
    letter: string;
}



const Home: React.FC = () => {
    const [letter, setLetter] = useState<string>('');
    const [groups, setGroups] = useState<GroupModel[]>([]);
    const [groupsSelected, setGroupsSelected] = useState<GroupModel[]>([]);

    const [words, setWords] = useState<WordsResponse[]>([]);

    useEffect(() => {
        GetGroups();
    }, []);

    async function GetGroups() {
        try {
            const response = await api.get<GroupModel[]>('wordgroups');
            setGroups(response.data);
        } catch {
            alert("Falha ao obter grupo");
        }
    }

    function SelectGroup(group: GroupModel) {
        const alreadySelected = groupsSelected.findIndex(item => item === group);

        if (alreadySelected >= 0) {
            const filteredItems = groupsSelected.filter(item => item !== group);
            setGroupsSelected(filteredItems);
        } else {
            setGroupsSelected([...groupsSelected, group]);
        }
    }

    async function handleSubmit(e: FormEvent) {
        e.preventDefault();
        try {
            const response = await api.post<WordsResponse[]>('hack', {
                wordGroups: groupsSelected,
                letter
            });
            setWords(response.data);
            console.log(response.data);
        }
        catch (error) {
            alert("Erro ao obter palavras" + error);
        }
    }


    return (
        <>
            <nav>
                <h2>Bem vindo StopHacker</h2>
            </nav>
            <div className="container">
                <main>
                    <form onSubmit={handleSubmit}>
                        <TextField
                            label="Letra"
                            inputProps={{
                                maxLength: 1,
                            }}
                            onChange={e => setLetter(e.target.value.toLowerCase())}
                            value={letter}
                        />
                        <Button variant="contained" color="inherit" type="submit">Pesquisar</Button>
                        <div className="objects">
                            {
                                groups.map(group => (
                                    <Button
                                        key={group._id} variant={groupsSelected.includes(group) ? "contained" : "outlined"} color={groupsSelected.includes(group) ? "primary" : "default"} onClick={() => SelectGroup(group)}>
                                        {group.label}
                                    </Button>
                                )
                                )
                            }
                        </div>
                    </form>
                    <article>
                        <table>
                            <thead>
                                <tr><th colSpan={2}><h1>Tabela de palavras</h1></th></tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td><h3>Grupo</h3></td>
                                    <td><h3>Palavras</h3></td>
                                </tr>
                                {
                                    groupsSelected.map(group => (
                                        <>
                                            <tr className="border-bottom">
                                                <td>{group.label}</td>
                                                <td>{words.map(word => group._id === word.wordGroup._id && word.label.concat(', '))}</td>
                                            </tr>
                                        </>
                                    ))
                                }
                            </tbody>
                        </table>
                    </article>
                </main>
            </div>

        </>
    );
}
export default Home;