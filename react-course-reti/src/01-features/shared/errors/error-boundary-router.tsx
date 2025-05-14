import { isRouteErrorResponse, useRouteError } from "react-router";
import NotFound from "./not-found";
import GenericError from "./generic-error";
import Unauthorized from "./unauthorized";
import { UnauthorizedError } from "./custom-exceptions/unauthorized-exception";
import { useEffect } from "react";
import { NotFound404Error } from "./custom-exceptions/not-found-404";

const ErrorBoundaryRouter = () => {
	const error = useRouteError();
	useEffect(() => {
    document.body.style.removeProperty('pointer-events');   
	}, []); // Se arrivo da mobile con errore partito dalla sidebar, il body ha come stile pointer-events: none, che blocca le interazioni sulle pagine di errore, la rimuovo

	if(isRouteErrorResponse(error)){
		if(error.status === 404)
			return (<NotFound />)

		return (<GenericError />)
	}

	if(error instanceof UnauthorizedError)
		return (<Unauthorized />)
	else if (error instanceof NotFound404Error)
		return (<NotFound />)

	return (<GenericError />)
}
export default ErrorBoundaryRouter;