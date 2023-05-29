import { useEffect } from "react";
import { Link, useParams, useNavigate, useLocation } from "react-router-dom"
import styled from "styled-components"
import axios from "axios";
import { useState } from "react";

export default function SuccessPage() {

    const {CPF, buyerName, selecionados, seats, infos} = useLocation().state;

    console.log(selecionados)

    const navigate = useNavigate();

    function returnHome() {
        navigate('/');
    }

    let finalCPF = '';

    for (let i = 1; i < CPF.length+1; i++){
        if (i % 3 === 0 && i !== 9){
            finalCPF += CPF[i-1] + '.'
        }else if (i === 9){
            finalCPF += CPF[i-1] + '-'
        }else{
            finalCPF += CPF[i-1];
        }
    }

    return (
        <PageContainer>
            <h1>Pedido feito <br /> com sucesso!</h1>

            <TextContainer data-test="movie-info">
                <strong><p>Filme e sessão</p></strong>
                <p>{infos.movie.title}</p>
                <p>{infos.day.date} - {infos.name}</p>
            </TextContainer>

            <TextContainer data-test="seats-info">
                <strong><p>Ingressos</p></strong>
                {selecionados.map((seat, i) => 
                    <p>Assento {seat}</p>)
                }
            </TextContainer>

            <TextContainer data-test="client-info">
                <strong><p>Comprador</p></strong>
                <p>Nome: {buyerName}</p>
                <p>CPF: {finalCPF}</p>
            </TextContainer>

            <button onClick={returnHome} data-test="go-home-btn">Voltar para Home</button>
        </PageContainer>
    )
}

const PageContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    font-family: 'Roboto';
    font-size: 24px;
    color: #293845;
    margin: 30px 20px;
    padding-bottom: 120px;
    padding-top: 70px;
    a {
        text-decoration: none;
    }
    button {
        margin-top: 50px;
    }
    h1 {
        font-family: 'Roboto';
        font-style: normal;
        font-weight: 700;
        font-size: 24px;
        line-height: 28px;
        display: flex;
        align-items: center;
        text-align: center;
        color: #247A6B;
    }
`
const TextContainer = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    margin-top: 30px;
    strong {
        font-weight: bold;
        margin-bottom: 10px;
    }
`