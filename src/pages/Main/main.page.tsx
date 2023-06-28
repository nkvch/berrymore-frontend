import { Button, Divider, Typography } from "@mui/material";
import { AccordionItem, Accordions } from "../../components/Accordions/Accordions";
import styled from "@emotion/styled";

const BigVideo = styled.video`
  width: 100%;
  @media screen and (min-width: 1024px) {
    width: 50%;
  }
`;

const BigImage = styled.img`
  width: 100%;
  @media screen and (min-width: 1024px) {
    width: 50%;
  }
`;

function MainPage() {
  return (
    <>
      <Divider />
      <p>Незаменимый помощник-приложение по управлению ручным сбором и статистическому анализу собранного урожая.</p>
      <p>Что умеет Бэрримор:</p>
      <Accordions>
        <AccordionItem open title="Оптимизировать и ускорять процесс формирования бригад сборщиков">
          <p>Приложение позволяет быстро и эффективно формировать бригады сборщиков, а также контролировать их работу в поле.</p>
          <BigVideo controls autoPlay={true} muted>
            <source src='/landing/videos/clicking_emps2.mp4' type='video/mp4' />
          </BigVideo>
        </AccordionItem>
        <AccordionItem title="Эффективно контролировать вес собранной ягоды по каждому из сборщиков, работающих в поле, с использованием QR-кодов.">
          <p>Приём ягоды от сборщиков в поле осуществляется быстро и без очередей. Использование приложения позволяет одному бригадиру контролировать до 100 сборщиков.</p>
          <BigVideo controls autoPlay={true} muted>
            <source src='/landing/videos/scanning.mp4' type='video/mp4' />
          </BigVideo>
        </AccordionItem>
        <AccordionItem title="Предоставлять данные о сборе в реальном времени">
          <p>Руководитель имеет доступ к данным о сборе в реальном времени из любой точки мира</p>
          <div style={{
            display: 'flex',
            justifyContent: 'space-around',
            alignItems: 'center',
            flexWrap: 'wrap'
          }} >
            <BigImage src='/landing/Stats.jpeg' alt='Realtime screenshot' />
            <img style={{
              maxHeight: '600px'
            }} src='/landing/stats.jpeg' alt='Realtime screenshot' />
          </div>
        </AccordionItem>
        <AccordionItem title="Анализировать статистику сбора урожая">
          <p>Статистический анализ позволяет очень быстро оценивать эффективность каждого сборщика или бригады и делать соответсвующие выводы.</p>
          <BigVideo controls autoPlay={true} muted>
            <source src='/landing/videos/analysis.webm' type='video/webm' />
          </BigVideo>
        </AccordionItem>
        <AccordionItem title="Мгновенно начислять заработную плату сборщикам">
          <p>Приложение незаменимо при ежедневном рассчете сборщиков. Практика показала что один кассир может за 40 минут рассчитать до 150 сборщиков без лишней бумажной рутины.</p>
          <BigVideo controls autoPlay={true} muted>
            <source src='/landing/videos/payroll.webm' type='video/webm' />
          </BigVideo>
        </AccordionItem>
      </Accordions>
      <Typography sx={{
        marginTop: '20px',
        marginBottom: '20px'
      }}>
        Пользование в сезон 2023 - бесплатно!
      </Typography>
      <Divider />
      <Button
        variant="contained"
        color="primary"
        href="/signup"
        style={{ marginBottom: '20px', marginTop: '20px' }}
      >
        Начать
      </Button>
    </>
  )
}

export default MainPage;
