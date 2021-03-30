import * as React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { Loader } from "google-maps";
import { makeCarIcon, makeMarkerIcon, Map } from "../../util/map";
import { getCurrentPosition } from "../../util/geolocation";
import { Button, Grid, makeStyles, MenuItem, Select } from "@material-ui/core";
import { Route } from "../../util/models";
import { sample, shuffle } from "lodash";
import { useSnackbar } from "notistack";
import { RouteExistsError } from "../../errors/route-exists.error";
import { Navbar } from "../Navbar";
import io from "socket.io-client";

const API_URL = process.env.REACT_APP_API_URL as string;

const loader = new Loader(process.env.REACT_APP_GOOGLE_API_KEY);

const colors = [
  "#b71c1c",
  "#4a148c",
  "#2e7d32",
  "#e65100",
  "#2962ff",
  "#c2185b",
  "#FFCD00",
  "#3e2723",
  "#03a9f4",
  "#827717"
];

const useStyles = makeStyles({
  root: {
    width: "100%",
    height: "100%",
  },
  form: {
    margin: "16px",
  },
  btnSubmitWrapper: {
    textAlign: "center",
    margin: "8px",
  },
  mapWrapper: {
    width: "100%",
    height: "100%",
  },
  map: {
    width: "100%",
    height: "100%",
  },
});

const Mapping = () => {
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();
  const [routes, setRoutes] = useState<Route[]>([]);
  const [routeIdSelected, setRouteIdSelected] = useState<string>("");
  const mapRef = React.useRef<Map>();
  const socketIORef = React.useRef<SocketIOClient.Socket>();

  const finishRoute = React.useCallback(
    (id: string) => {
      const route = routes.find((route) => routeIdSelected == route.id);
      enqueueSnackbar(`${route?.title} finalizou!`, { variant: "success" });
      mapRef.current?.removeRoute(id);
    },
    [routes, routeIdSelected, enqueueSnackbar]
  );

  useEffect(() => {
    return () => {
      if (socketIORef.current?.connected) {
        socketIORef.current?.disconnect();
      }
    };
  }, []);

  useEffect(() => {
    console.log(socketIORef, socketIORef.current?.connected);
    if (socketIORef.current?.connected) {
      return;
    }
    socketIORef.current = io.connect(API_URL);
    console.log("useEffect");
    socketIORef.current.on("connect", () => {
      console.log("conectou");
      socketIORef.current?.emit("join", { teste: "test" });
    });

    socketIORef.current.on(
      "new-position",
      (data: {
        routeId: string;
        position: [number, number];
        finished: boolean;
      }) => {
        mapRef.current!.moveCurrentMarker(data.routeId, {
          lat: data.position[0],
          lng: data.position[1],
        });

        if (data.finished) {
          finishRoute(data.routeId);
        }
      }
    );
  }, [finishRoute]);

  const addRoute = React.useCallback(
    async (event) => {
      event.preventDefault();
      const route = routes.find((route) => routeIdSelected === route.id);
      const color = sample(shuffle(colors)) as string;
      try {
        mapRef.current?.addRoute(
          route!.id,
          {
            title: `Rota ${route?.title}`,
            position: {
              lat: route!.startPosition.lat,
              lng: route!.startPosition.lng,
            },
            icon: makeCarIcon(color),
          },
          {
            title: `Rota ${route?.title} - Fim`,
            position: {
              lat: route!.endPosition.lat,
              lng: route!.endPosition.lng,
            },
            icon: makeMarkerIcon(color),
          }
        );
        socketIORef.current?.emit("new-direction", {
          routeId: routeIdSelected,
        });
      } catch (error) {
        if (error instanceof RouteExistsError) {
          enqueueSnackbar(`${route?.title} já adicionada, espera finalizar.`, {
            variant: "error",
          });
          return;
        }
        throw error;
      }
    },
    [routeIdSelected, routes, enqueueSnackbar]
  );

  useEffect(() => {
    fetch(`${API_URL}/routes`)
      .then((data) => data.json())
      .then((data) => setRoutes(data));
  }, []);

  useEffect(() => {
    (async () => {
      const [, position] = await Promise.all([
        loader.load(),
        getCurrentPosition({
          enableHighAccuracy: true,
        }),
      ]);
      const divMap = document.getElementById("map") as HTMLElement;
      mapRef.current = new Map(divMap, { zoom: 15, center: position });
    })();
  }, []);

  return (
    <Grid container className={classes.root}>
      <Grid item xs={12} sm={3}>
        <Navbar />
        <form onSubmit={addRoute} className={classes.form}>
          <Select
            fullWidth
            displayEmpty
            value={routeIdSelected}
            onChange={(event) => setRouteIdSelected(event.target.value + "")}
          >
            <MenuItem value="">
              <em>Selecione uma corrida</em>
            </MenuItem>
            {routes.map((route, key) => (
              <MenuItem key={key} value={route.id}>
                {route.title}
              </MenuItem>
            ))}
          </Select>
          <div className={classes.btnSubmitWrapper}>
            <Button type="submit" color="primary" variant="contained">
              Iniciar corrida
            </Button>
          </div>
        </form>
      </Grid>
      <Grid item className={classes.mapWrapper} xs={12} sm={9}>
        <div id={"map"} className={classes.map} />
      </Grid>
    </Grid>
  );
};

export default Mapping;
