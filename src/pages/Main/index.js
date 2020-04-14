import React, { Component } from 'react';
import { FaGithubAlt, FaPlus, FaSpinner } from 'react-icons/fa';
import { Link } from 'react-router-dom';

import api from '../../services/api';

import Container from '../../components/Container';

import { Form, SubmitButton, List } from './styles';

class Main extends Component {
    state = {
        newRepo: '',
        repositories: [],
        loading: false,
        error: null,
    };

    componentDidMount() {
        const repositories = localStorage.getItem('repositories');

        if (repositories) {
            this.setState({ repositories: JSON.parse(repositories) });
        }
    }

    componentDidUpdate(_, prevState) {
        const { repositories } = this.state;

        if (prevState.repositories !== repositories) {
            localStorage.setItem('repositories', JSON.stringify(repositories));
        }
    }

    handleInputChange = (e) => {
        this.setState({ newRepo: e.target.value, error: null });
    };

    handleSubmit = async (e) => {
        e.preventDefault();

        this.setState({ loading: true, error: false });

        try {
            const { newRepo, repositories } = this.state;
            const hasRepo = repositories.find((r) => r.name === newRepo);

            if (hasRepo === newRepo) throw new Error('Repositório duplicado');

            const response = await api.get(`/repos/${newRepo}`);

            const data = {
                name: response.data.full_name,
            };

            this.setState({
                repositories: [...repositories, data],
                newRepo: '',
                loading: false,
            });
        } catch (error) {
            this.setState({ error: true });
        }
    };

    render() {
        const { newRepo, repositories, loading, error } = this.state;

        return (
            <Container>
                <h1>
                    <FaGithubAlt />
                    Repositorios
                </h1>

                <Form onSubmit={this.handleSubmit} error={error}>
                    <input
                        type="text"
                        value={newRepo}
                        placeholder="Adicionar repositorio"
                        onChange={this.handleInputChange}
                    />

                    <SubmitButton loading={loading}>
                        {loading ? (
                            <FaSpinner color="#fff" size={14} />
                        ) : (
                            <FaPlus color="#fff" size={14} />
                        )}
                    </SubmitButton>
                </Form>

                <List>
                    {repositories.map((repository) => (
                        <li key={repository.name}>
                            <span>{repository.name}</span>
                            <Link
                                to={`/repository/${encodeURIComponent(
                                    repository.name
                                )}`}
                            >
                                Detalhes
                            </Link>
                        </li>
                    ))}
                </List>
            </Container>
        );
    }
}
export default Main;
