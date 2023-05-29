import { useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom"
import styled from "styled-components"
import axios from "axios";
import { useState } from "react";

export default function SeatsPage() {

    const [infos, setInfos] = useState([]);
    const [seats, setSeats] = useState([]);
    const [movie, setMovie] = useState([]);
    const [day, setDay] = useState([]);
    const [available, setAvailable] = useState([]);
    const [unavailable, setUnavailable] = useState([]);
    const [selected, setSelected] = useState([]);
    const [selectedId, setSelectedId] = useState([]);

    const [buyerName, setBuyerName] = useState('')
    const [CPF, setCPF] = useState('')

    const params = useParams();

    let newUnavailable;
    let newAvailable;

    const [teste, setTeste] = useState([]);

    const navigate = useNavigate();

    useEffect(() => {
        const URL = `https://mock-api.driven.com.br/api/v8/cineflex/showtimes/${params.idassento}/seats`;

        const promise = axios.get(URL);
        promise.then((resposta) => {
            const preInfo = resposta.data
            setInfos(preInfo);
            const preSeats = resposta.data.seats
            setSeats(preSeats);
            const preMovie = resposta.data.movie
            setMovie(preMovie);
            const preDay = resposta.data.day
            setDay(preDay);
            verify(preSeats);
    })
        promise.catch(erro => console.log(erro.response.data))
    }, [])

    function verify(seat) {
        for (let i = 0; i < seat.length; i++){
            if(seat[i].isAvailable === false){
                newUnavailable = unavailable;
                newUnavailable.push(seat[i].name)
                setUnavailable(newUnavailable);
            } else {
                newAvailable = available;
                newAvailable.push(seat[i].name)
                setAvailable(newAvailable);
            }
        } 
    }

    function select(i) {
        if(unavailable.includes(i)){
            return alert('Esse assento não está disponível')
        } else if (selected.includes(i)){
            return unselect(i);
        }else{
            const newSelected = [...selected, i]
            setSelected(newSelected);
            console.log(newSelected);
            const newSelectedID = [...selectedId, seats[i-1].id];
            setSelectedId(newSelectedID)
            console.log(newSelectedID)
        }
    }

    function unselect(i){
        let index;
        for (let j = 0; j < selected.length; j++){
            if (selected[j] === i){
                index = j;
            }
        }
        const slice1 = selected.slice(0, index)
        const slice2 = selected.slice(index+1)
        const slicesName = [];

        for (let j = 0; j < slice1.length; j++){
            slicesName.push(slice1[j])
        }
        for (let j = 0; j < slice2.length; j++){
            slicesName.push(slice2[j])
        }        
        setSelected(slicesName);

        const slice3 = selectedId.slice(0, index)
        const slice4 = selectedId.slice(index+1)
        const slicesId = [];

        for (let j = 0; j < slice3.length; j++){
            slicesId.push(slice3[j])
        }
        for (let j = 0; j < slice4.length; j++){
            slicesId.push(slice4[j])
        }
        setSelectedId(slicesId);
    }

    const newPost ={
        ids: selectedId,
	    name: buyerName,
	    cpf: CPF
    }

    function submit(event) {
        event.preventDefault();
        console.log(newPost)

        if(selected.length > 0 && buyerName.length > 2 && CPF.length === 11){
            const URL = 'https://mock-api.driven.com.br/api/v8/cineflex/seats/book-many';
            const promise = axios.post(URL, newPost);
            promise.then(() => {
                navigate('/sucesso')
            })
            promise.catch(() => {
                alert('erro no post')
            })
            
        }else if (selected.length === 0){
            alert('Selecione pelo menos um assento')
        }else if (buyerName.length <3){
            alert('Digite um nome válido')
        }else if (CPF.length !== 11){
            alert('Digite um CPF válido')
        }
    }

    return (
        <PageContainer>
            Selecione o(s) assento(s)

            <SeatsContainer>
                {seats.map((seat) => (
                    <SeatItem 
                    data-test="seat"
                    key={seat.name}
                    onClick={() => select(seat.name)}
                    available={available.includes(seat.name)}
                    unavailable={unavailable.includes(seat.name)}
                    selected={selected.includes(seat.name)}>
                        {seat.name}
                    </SeatItem>
                ))}
            </SeatsContainer>

            <CaptionContainer>
                <CaptionItem>
                    <CaptionCircle
                    border={'#0E7D71'} 
                    color={'#1AAE9E'}
                    />
                    Selecionado
                </CaptionItem>
                <CaptionItem>
                    <CaptionCircle
                    border={'#808F9D'} 
                    color={'#C3CFD9'}
                    />
                    Disponível
                </CaptionItem>
                <CaptionItem>
                    <CaptionCircle 
                    border={'#F7C52B'} 
                    color={'#FBE192'}
                    />
                    Indisponível
                </CaptionItem>
            </CaptionContainer>

            <FormContainer onSubmit={submit}>
                <label>
                Nome do Comprador:
                <input 
                type='text'
                data-test="client-name" 
                placeholder="Digite seu nome..." 
                value={buyerName}
                onChange={(e) => setBuyerName(e.target.value)}
                required
                />
                </label>
                CPF do Comprador:
                <input 
                type='number'
                data-test="client-cpf" 
                placeholder="Digite seu CPF..."
                value={CPF}
                onChange={(e) => setCPF(e.target.value)}
                required
                />

                <button type="submit" data-test="book-seat-btn">Reservar Assento(s)</button>
            </FormContainer>

            <FooterContainer data-test="footer">
                <div>
                    <img src={movie.posterURL} alt="poster" />
                </div>
                <div>
                    <p>{movie.title}</p>
                    <p>{day.weekday} - {infos.name}</p>
                </div>
            </FooterContainer>

        </PageContainer>
    )
}

const PageContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    font-family: 'Roboto';
    font-size: 24px;
    text-align: center;
    color: #293845;
    margin-top: 30px;
    padding-bottom: 120px;
    padding-top: 70px;
`
const SeatsContainer = styled.div`
    width: 330px;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
    margin-top: 20px;
`
const FormContainer = styled.form`
    width: calc(100vw - 40px); 
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    margin: 20px 0;
    font-size: 18px;
    button {
        align-self: center;
    }
    input {
        width: calc(100vw - 60px);
    }
`
const CaptionContainer = styled.div`
    display: flex;
    flex-direction: row;
    width: 300px;
    justify-content: space-between;
    margin: 20px;
`
const CaptionCircle = styled.div`
    border: 1px solid ${(props => props.border)};         // Essa cor deve mudar
    background-color: ${(props => props.color)};    // Essa cor deve mudar
    height: 25px;
    width: 25px;
    border-radius: 25px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 5px 3px;
`
const CaptionItem = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    font-size: 12px;
`
const SeatItem = styled.div`
    border: 1px solid ${(props => {
        if(props.selected){
            return '#0E7D71';
        }else if(props.available){
            return '#808F9D';
        }else if(props.unavailable){
            return '#F7C52B';
        }
    })};

    background-color: ${(props => {
        if(props.selected){
            return '#1AAE9E';
        }else if(props.available){
            return '#C3CFD9';
        }else if(props.unavailable){
            return '#FBE192';
        }
    })};

    height: 25px;
    width: 25px;
    border-radius: 25px;
    font-family: 'Roboto';
    font-size: 11px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 5px 3px;
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