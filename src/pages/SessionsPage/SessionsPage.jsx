import { useEffect } from "react";
import { Link, useParams } from "react-router-dom"
import styled from "styled-components"
import axios from "axios";
import { useState } from "react";

export default function SessionsPage() {

    const [sessions, setSessions] = useState([]);

    const params = useParams();

    useEffect(() => {
        const URL = `https://mock-api.driven.com.br/api/v8/cineflex/movies/${params.idsessao}/showtimes`;

        const promise = axios.get(URL);
        promise.then((resposta) => {
            setSessions(resposta.data);
    })
        promise.catch(erro => console.log(erro.response.data))
    }, [])

    return (
        <PageContainer>
            Selecione o horário
            <div>
                {sessions.days && sessions.days.map((session,i) => (
                        <SessionContainer key={i} data-test="movie-day">
                            {session.weekday} - {session.date}
                            <ButtonsContainer>
                                {session.showtimes.map((time) => (
                                    <Link key={time.id} to={`/assentos/${time.id}`}>
                                        <button 
                                        data-test="showtime" 
                                        >{time.name}
                                        </button>
                                    </Link>
                                ))}
                            </ButtonsContainer>
                        </SessionContainer>
                ))}
            </div>

            <FooterContainer data-test="footer">
                <div>
                    <img src={sessions.posterURL} alt="poster" />
                </div>
                <div>
                    <p>{sessions.title}</p>
                </div>
            </FooterContainer>

        </PageContainer>
    )
}

const PageContainer = styled.div`
    display: flex;
    flex-direction: column;
    font-family: 'Roboto';
    font-size: 24px;
    text-align: center;
    color: #293845;
    margin-top: 30px;
    padding-bottom: 120px;
    padding-top: 70px;
    div {
        margin-top: 20px;
    }
`
const SessionContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    font-family: 'Roboto';
    font-size: 20px;
    color: #293845;
    padding: 0 20px;
`
const ButtonsContainer = styled.div`
    display: flex;
    flex-direction: row;
    margin: 20px 0;
    button {
        margin-right: 20px;
    }
    a {
        text-decoration: none;
    }
`
const FooterContainer = styled.div`
    width: 100%;
    height: 120px;
    background-color: #C3CFD9;
    display: flex;
    flex-direction: row;
    align-items: center;
    font-size: 20px;
    position: fixed;
    bottom: 0;

    div:nth-child(1) {
        box-shadow: 0px 2px 4px 2px #0000001A;
        border-radius: 3px;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: white;
        margin: 12px;
        img {
            width: 50px;
            height: 70px;
            padding: 8px;
        }
    }

    div:nth-child(2) {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        p {
            text-align: left;
            &:nth-child(2) {
                margin-top: 10px;
            }
        }
    }
`