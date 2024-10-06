/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   keys.c                                             :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: tgomes-l <tgomes-l@student.42wolfsburg.    +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2023/02/28 17:54:11 by tgomes-l          #+#    #+#             */
/*   Updated: 2023/04/27 18:31:49 by tgomes-l         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "../includes/so_long.h"

int	ft_key_event(int key, t_data *data)
{
	if (key == KEY_ESC)
	{
		ft_free_all(data);
		exit(EXIT_SUCCESS);
	}
	else if (key == KEY_W || key == KEY_W_LOW || key == KEY_UP_A)
	{
		ft_check_up(data, -1, 0);
	}
	else if (key == KEY_S || key == KEY_S_LOW || key == KEY_DOWN_A)
	{
		ft_check_up(data, 1, 0);
	}
	else if (key == KEY_A || key == KEY_A_LOW || key == KEY_LEFT_A)
	{
		ft_check_up(data, 0, -1);
	}
	else if (key == KEY_D || key == KEY_D_LOW || key == KEY_RIGHT_A)
	{
		ft_check_up(data, 0, 1);
	}
	return (0);
}

void	ft_check_up(t_data *data, int y, int x)
{
	if (data->map_2d[data->ply_y + y][data->ply_x + x] == '1')
		return ;
	if (data->map_2d[data->ply_y + y][data->ply_x + x] == 'C')
		data->tmp_collectible--;
	data->move_count++;
	data->map_2d[data->ply_y][data->ply_x] = '0';
	data->ply_y += y;
	data->ply_x += x;
	data->map_2d[data->ply_y][data->ply_x] = 'P';
	data->map_2d[data->ex_y][data->ex_x] = 'E';
	if (y == -1)
		data->curr_pos = 'U';
	else if (y == 1)
		data->curr_pos = 'D';
	else if (x == -1)
		data->curr_pos = 'L';
	else if (x == 1)
		data->curr_pos = 'R';
	ft_check_mov(data);
	ft_render_after_move(data);
}
