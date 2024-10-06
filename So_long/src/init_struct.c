/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   init_struct.c                                      :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: tgomes-l <tgomes-l@student.42wolfsburg>    +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2023/03/24 09:53:05 by tgomes-l          #+#    #+#             */
/*   Updated: 2023/04/27 21:53:49 by tgomes-l         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "../includes/so_long.h"

//x=columns, y=rows
static void	ft_handle_ex_and_p(t_data *data, int x, int y)
{
	if (data->map_2d[y][x] == 'E')
	{
		data->ex_x = x;
		data->ex_y = y;
		data->valid_ex++;
	}
	else if (data->map_2d[y][x] == 'P')
	{
		data->ply_x = x;
		data->ply_y = y;
	}
}

static void	ft_handle_collectibles(t_data *data, int x, int y)
{
	if (data->map_2d[y][x] == 'C')
	{
		data->tmp_collectible++;
		data->total_collectible++;
	}
}

void	ft_get_player(t_data *data)
{
	int	x;
	int	y;

	y = 0;
	data->tmp_collectible = 0;
	data->total_collectible = 0;
	data->valid_ex = 0;
	while (y < data->map_y)
	{
		x = 0;
		while (x < data->map_x)
		{
			ft_handle_ex_and_p(data, x, y);
			ft_handle_collectibles(data, x, y);
			x++;
		}
		y++;
	}
}
