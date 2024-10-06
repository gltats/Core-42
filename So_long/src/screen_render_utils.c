/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   screen_render_utils.c                              :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: tgomes-l <tgomes-l@student.42wolfsburg>    +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2023/04/27 22:10:26 by tgomes-l          #+#    #+#             */
/*   Updated: 2023/04/27 22:19:19 by tgomes-l         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "../includes/so_long.h"

void	ft_put_image_wall(t_data *data, int x, int y)
{
	mlx_put_image_to_window(data->mlx, data->window,
		data->wall, x * 32, y * 32);
}

void	ft_put_image_backg(t_data *data, int x, int y)
{
	mlx_put_image_to_window(data->mlx, data->window,
		data->backg, x * 32, y * 32);
}

void	ft_put_image_colect(t_data *data, int x, int y)
{
	mlx_put_image_to_window(data->mlx, data->window,
		data->colect, x * 32, y * 32);
}

void	ft_put_image_exit(t_data *data, int x, int y)
{
	mlx_put_image_to_window(data->mlx, data->window,
		data->exit, x * 32, y * 32);
}

void	ft_put_image_player_cond(t_data *data, int x, int y)
{
	if (data->ply_y == y && data->ply_x == x
		&& data->map_2d[data->ex_y][data->ex_x] == 'E')
		ft_put_image_player(data, x * 32, y * 32);
	else if (data->map_2d[y][x] == 'P')
		ft_put_image_player(data, x * 32, y * 32);
}
