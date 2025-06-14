using AutoMapper;
using CegCRMAPI.Application.DTOs.Common;
using CegCRMAPI.Application.DTOs.Note;
using CegCRMAPI.Application.Repositories;
using MediatR;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace CegCRMAPI.Application.Features.Queries.Note.GetNoteById
{
    public class GetNoteByIdQuery : IRequest<ApiResponse<NoteDto>>
    {
        public Guid Id { get; set; }
    }

    public class GetNoteByIdQueryHandler : IRequestHandler<GetNoteByIdQuery, ApiResponse<NoteDto>>
    {
        private readonly INoteRepository _noteRepository;
        private readonly IMapper _mapper;

        public GetNoteByIdQueryHandler(INoteRepository noteRepository, IMapper mapper)
        {
            _noteRepository = noteRepository;
            _mapper = mapper;
        }

        public async Task<ApiResponse<NoteDto>> Handle(GetNoteByIdQuery request, CancellationToken cancellationToken)
        {
            try
            {
                var note = await _noteRepository.GetByIdAsync(request.Id);
                if (note == null)
                    return ApiResponse<NoteDto>.CreateError("Note not found");

                var noteDto = _mapper.Map<NoteDto>(note);
                return ApiResponse<NoteDto>.CreateSuccess(noteDto, "Note retrieved successfully");
            }
            catch (Exception ex)
            {
                return ApiResponse<NoteDto>.CreateError($"Failed to retrieve note: {ex.Message}");
            }
        }
    }
} 