CC  		= clang++
RM  		= rm -fr
SRCS 		= $(wildcard *.cc)
OBJS 		= $(SRCS:.cc=.o)

NAME 		= business
#
.PHONY = all clean re
all: $(OBJS)
	$(CC) $(IPATH) $(LPATH) $(OBJS) -o $(NAME) $(LIB) $(DBGLIBS)
%.o : %.cc
	$(CC) -c $(IPATH) $(CFLAGS) $(OPTFLGS) $< -o $@
clean :
	$(RM) *.o *.cc~ *hh~ *~ Makefile~ $(NAME)
re : clean all

