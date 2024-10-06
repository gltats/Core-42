/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   game.c                                             :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: tgomes-l <tgomes-l@student.42wolfsburg>    +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2023/02/28 23:34:38 by tgomes-l          #+#    #+#             */
/*   Updated: 2023/04/27 21:44:33 by tgomes-l         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "../includes/so_long.h"

void	ft_free_all(t_data *data)
{
	int	i;

	i = 0;
	if (data->map)
		free(data->map);
	if (data->map_2d)
	{
		while (data->map_2d[i])
		{
			free(data->map_2d[i]);
			i++;
		}
		free(data->map_2d);
	}
}

void	ft_free_mlx(t_data *data)
{
	mlx_destroy_image(data->mlx, data->backg);
	mlx_destroy_image(data->mlx, data->colect);
	mlx_destroy_image(data->mlx, data->wall);
	mlx_destroy_image(data->mlx, data->exit);
	mlx_destroy_image(data->mlx, data->p_right);
	mlx_destroy_image(data->mlx, data->p_up);
	mlx_destroy_image(data->mlx, data->p_left);
	mlx_destroy_image(data->mlx, data->p_down);
	mlx_destroy_window(data->mlx, data->window);
	free(data->mlx);
}

int	ft_close_window(t_data *data)
{
	mlx_clear_window(data->mlx, data->window);
	ft_free_mlx(data);
	ft_free_all(data);
	exit(EXIT_SUCCESS);
	return (0);
}

void	handle_mlx_graphics(t_data	*data)
{
	(data)->mlx = mlx_init();
	ft_get_player(data);
	create_map_copy(data);
	ft_check_path(data);
	ft_in_image(data);
	mlx_hook(data->window, 17, 0, ft_close_window, data);
	mlx_hook(data->window, 2, 0, ft_key_event, data);
	mlx_loop(data->mlx);
}
