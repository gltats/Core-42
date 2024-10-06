/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   so_long.h                                          :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: tgomes-l <tgomes-l@student.42wolfsburg>    +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2023/02/15 17:04:34 by tgomes-l          #+#    #+#             */
/*   Updated: 2023/04/27 22:19:43 by tgomes-l         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#ifndef SO_LONG_H
# define SO_LONG_H

# include <stdlib.h>
# include <unistd.h>
# include <string.h>
# include <stdio.h>
# include <sys/wait.h>
# include <fcntl.h>
# include "../libft/libft.h"
# include "../minilibx/mlx.h"

# define BACKG "./textures/background.xpm"
# define P_UP "./textures/pacman_up.xpm"
# define P_DOWN "./textures/pacman_down.xpm"
# define P_LEFT "./textures/pacman_left.xpm"
# define P_RIGHT "./textures/pacman_right.xpm"
# define EXIT "./textures/portal.xpm"
# define WALL "./textures/wall.xpm"
# define COLLECTIBLE "./textures/cherry.xpm"

# define KEY_ESC			53
# define KEY_W				13
# define KEY_A				0
# define KEY_S				1
# define KEY_D				2
# define KEY_W_LOW			119
# define KEY_A_LOW			97
# define KEY_S_LOW			115
# define KEY_D_LOW			100
# define KEY_UP_A			126
# define KEY_DOWN_A			125
# define KEY_LEFT_A			123
# define KEY_RIGHT_A		124

typedef struct s_data
{
	void	*mlx;
	void	*window;
	void	*backg;
	void	*wall;
	void	*p_right;
	void	*p_up;
	void	*p_left;
	void	*p_down;
	int		ply_x;
	int		ply_y;
	int		ply_count;
	int		start;
	void	*colect;
	int		tmp_collectible;
	int		total_collectible;
	void	*exit;
	int		ex_y;
	int		ex_x;
	int		col_x;
	int		col_y;
	int		ex_counter;
	int		valid_ex;
	char	*map;
	char	**map_2d;
	char	**tmp_map_2d;
	int		map_x;
	int		map_y;
	int		map_height;
	int		map_width;
	int		temp_map_width;
	int		temp_map_height;
	int		img_y;
	int		img_x;
	char	*move_count_screen;
	int		move_count;
	char	curr_pos;
}	t_data;

//so_long.c
int		manage_fd(char *filename);
//validate.c
int		is_map_valid(char *map, t_data **data);
//validate_walls.c
int		is_map_closed(t_data **data);
//game.c
void	handle_mlx_graphics(t_data	*data);
int		ft_close_window(t_data *data);
void	ft_free_mlx(t_data *data);
void	ft_free_all(t_data *data);
//screen_render.c
void	ft_in_image(t_data *data);
void	ft_put_image(t_data *data);
void	ft_put_image_player(t_data *data, int x, int y);
void	ft_xy_oper(int *x, int *y, t_data *data);
//screen_render_utils.c
void	ft_put_image_wall(t_data *data, int x, int y);
void	ft_put_image_backg(t_data *data, int x, int y);
void	ft_put_image_colect(t_data *data, int x, int y);
void	ft_put_image_exit(t_data *data, int x, int y);
void	ft_put_image_player_cond(t_data *data, int x, int y);
//keys.c
int		ft_key_event(int key, t_data *data);
void	ft_check_right(t_data *data);
void	ft_check_left(t_data *data);
void	ft_check_down(t_data *data);
void	ft_check_up(t_data *data, int y, int x);
void	ft_get_player(t_data *data);
//validate_path.c
void	create_map_copy(t_data *data);
void	ft_check_path(t_data *data);
void	ft_check_validmap(t_data *data, int x, int y);
//movements.c
int		ft_check_mov(t_data *data);
void	ft_render_after_move(t_data *data);
#endif