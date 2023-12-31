import { FC, useEffect } from 'react'
import { useActionRef } from '@/hooks'
import {
  Icon24Spinner,
  Icon28ArticleOutline,
  Icon28CancelCircleOutline,
  Icon28CheckCircleOutline,
  Icon28ChevronRightOutline,
  Icon28CompassOutline,
  Icon28ErrorOutline,
  Icon28GhostOutline,
  Icon28PawOutline,
  Icon28WarningTriangleOutline
} from '@vkontakte/icons'
import { send } from '@vkontakte/vk-bridge'
import {
  Avatar,
  Gradient,
  Group,
  NavIdProps,
  Panel,
  PanelHeader,
  Platform,
  ScreenSpinner,
  SimpleCell,
  Text,
  Title,
  usePlatform
} from '@vkontakte/vkui'
import { classNamesString } from '@vkontakte/vkui/dist/lib/classNames'

import { ErrorSnackbar, SuccessSnackbar } from '@/components'
import { useModalStore, usePopoutStore, useSnackbarStore, useUserStore } from '@/store'

import './home.css'
import { TestActionSheet, TestAlert, TestModalCard } from '@/popouts'
import { useRouteNavigator } from '@vkontakte/vk-mini-apps-router'
import { URL } from '@/router'

export const Home: FC<NavIdProps> = (props) => {
  const platform = usePlatform()

  const user = useUserStore.use.user()
  const setUser = useUserStore.use.setUser()
  const setSnackbar = useSnackbarStore.use.setSnackbar()
  const clearPopout = usePopoutStore.use.clearPopout()
	const setPopout = usePopoutStore.use.setPopout()
	const setModal = useModalStore.use.setModal()

  const { setActionRefHandler } = useActionRef(() =>
    setPopout(<TestActionSheet/>)
  )

  useEffect(() => {
    send('VKWebAppGetUserInfo').then((value) => setUser(value))
    console.log(window.location.href)
  }, [])


  const setLoadingScreenSpinner = () => {
    setPopout(<ScreenSpinner state="loading" />);
    setTimeout(clearPopout, 2000);
  };

  const router = useRouteNavigator()

  return (
    <Panel {...props}>
      <PanelHeader>Главная</PanelHeader>

      <Group>
        <Gradient
          className={classNamesString(
            'Gradient',
            platform === Platform.VKCOM && 'Gradient__desktop'
          )}
        >
          <Avatar src={user?.photo_100} size={96} />
          <Title className="Gradient_Title" level="2" weight="2">
            {!user && 'Загрузка...'}
            {user?.first_name} {user?.last_name}
          </Title>
          <Text weight="3" className="Gradient_Subtitle">
            Пользователь
          </Text>
        </Gradient>

        <Group mode="plain">
          <SimpleCell
            before={<Icon28PawOutline />}
            after={<Icon28ChevronRightOutline />}
            onClick={() => router.push(URL.persikPanel)}
          >
            Перейти к Персику
          </SimpleCell>

          <SimpleCell
            before={<Icon28CompassOutline />}
            after={<Icon28ChevronRightOutline />}
            onClick={() => router.push(URL.componentsPanel)}
          >
            Перейти к компонентам
          </SimpleCell>

          <SimpleCell
            before={<Icon28ErrorOutline />}
            after={<Icon28ChevronRightOutline />}
            onClick={() => router.push(`/abobus`)}
          >
            Перейти к 404 странице
          </SimpleCell>
        </Group>
      </Group>

      <Group>
        <SimpleCell
          before={<Icon28GhostOutline />}
          onClick={() => setModal("TestModalCard")}
        >
          Показать модальную карточку
        </SimpleCell> 
      </Group>

      <Group>
        <SimpleCell
          before={<Icon28ArticleOutline />}
          onClick={setActionRefHandler}
        >
          Показать действия
        </SimpleCell>

        <SimpleCell
          before={<Icon28WarningTriangleOutline />}
          onClick={() => setPopout(<TestAlert/>)}
        >
          Показать предупреждение
        </SimpleCell>

        <SimpleCell
          before={<Icon24Spinner width={28} />}
          onClick={setLoadingScreenSpinner}
        >
          Показать экран загрузки
        </SimpleCell>
      </Group>

      <Group>
        <SimpleCell
          before={<Icon28CheckCircleOutline />}
          onClick={() =>
            setSnackbar(<SuccessSnackbar>Произошёл успех</SuccessSnackbar>)
          }
        >
          Показать добрый снекбар
        </SimpleCell>

        <SimpleCell
          before={<Icon28CancelCircleOutline />}
          onClick={() =>
            setSnackbar(<ErrorSnackbar>Произошла ошибка</ErrorSnackbar>)
          }
        >
          Показать злой снекбар
        </SimpleCell>
      </Group>
    </Panel>
  )
}
